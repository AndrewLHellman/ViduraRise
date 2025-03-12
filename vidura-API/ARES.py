from flask import Flask, request, jsonify
from flask_cors import CORS

from llama_index.core import VectorStoreIndex, Document
from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.core.prompts import PromptTemplate
from llama_index.core.query_engine import RetryQueryEngine
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings
from langchain_community.embeddings import HuggingFaceEmbeddings
from llama_index.core.indices.query.query_transform import HyDEQueryTransform
from tenacity import retry, stop_after_attempt, wait_exponential
from llama_index.core.prompts.prompts import SimpleInputPrompt
from llama_index.core import SimpleDirectoryReader

import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForCausalLM, BitsAndBytesConfig
from tenacity import retry, stop_after_attempt, wait_exponential

from huggingface_hub import login
from dotenv import load_dotenv
import os
from transformers import BitsAndBytesConfig

from accelerate import infer_auto_device_map

load_dotenv()

os.environ['PYTORCH_CUDA_ALLOC_CONF'] = os.getenv('PYTORCH_CUDA_ALLOC_CONF', '0')

class DataLoader:
    """Handles loading research papers from the given directory."""
    def __init__(self, directory_path):
        self.directory_path = directory_path

    def load_documents(self):
        return SimpleDirectoryReader(self.directory_path).load_data()

class ModelLoader:
    """Loads the LLM model, tokenizer, and embedding model."""
    def __init__(self, model_name, quantization_config=None, max_tokens=int(os.getenv("MAX_TOKENS")), temperature=float(os.getenv("TEMPERATURE")), top_k=int(os.getenv("TOP_K")), top_p=float(os.getenv("TOP_P"))): #set params here
        self.model_name = model_name
        self.quantization_config = quantization_config
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.top_k = top_k
        self.top_p = top_p

    def load_model_and_tokenizer(self):
        # Reduce GPU memory allocation and increase CPU usage
        max_memory = {
            0: os.getenv('GPU_MEMORY'),  # Reduced from 3GiB
            "cpu": os.getenv('CPU_MEMORY')  # Increased CPU memory
        }

        tokenizer = AutoTokenizer.from_pretrained(self.model_name)

        # Set more conservative compute settings
        model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            device_map="auto",  # Let it automatically handle device mapping
            low_cpu_mem_usage=True,
            torch_dtype=torch.float16,
            quantization_config=self.quantization_config,
            max_memory=max_memory,
            offload_folder="offload_folder",
            offload_state_dict=True  # Enable state dict offloading
        )

        return model, tokenizer

    def initialize_llm(self, model, tokenizer):
        return HuggingFaceLLM(
            context_window=2048,
            max_new_tokens=self.max_tokens,
            model=model,
            tokenizer=tokenizer,
            generate_kwargs={
                "temperature": self.temperature,
                "do_sample": True,
                "top_k": self.top_k,
                "top_p": self.top_p,
            },
            device_map="auto",
            tokenizer_kwargs={"clean_up_tokenization_spaces": True},
        )

    def load_embedding_model(self, embedding_model_name=os.getenv('EMBEDDING_MODEL_NAME')):
        return HuggingFaceEmbeddings(model_name=embedding_model_name)

class Indexer:
    """Creates an index from the loaded documents."""
    def __init__(self, llm, embed_model, chunk_size=int(os.getenv("CHUNK_SIZE")), chunk_overlap=int(os.getenv("CHUNK_OVERLAP"))):
        self.llm = llm
        self.embed_model = embed_model
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def create_index(self, documents):
        Settings.llm = self.llm
        Settings.embed_model = self.embed_model
        Settings.node_parser = SentenceSplitter(chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        return VectorStoreIndex.from_documents(documents)


os.environ['HF_TOKEN'] = os.getenv('HF_TOKEN')
login(token=os.environ['HF_TOKEN'])

# Data loading
data_loader = DataLoader(os.getenv('DATA_DIRECTORY'))
documents = data_loader.load_documents()

# Model initialization
model_name = os.getenv('MODEL_NAME') # Only 1.1B parameters

#quantizing the model
quant_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    llm_int8_threshold=6.0,
    llm_int8_has_fp16_weight=True
)

# Before loading the model
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()
    import gc
    gc.collect()

os.makedirs("offload_folder", exist_ok=True)

# Load model and tokenizer
model_loader = ModelLoader(model_name, quant_config)
model, tokenizer = model_loader.load_model_and_tokenizer()
llm = model_loader.initialize_llm(model, tokenizer)
embed_model = model_loader.load_embedding_model()

# Index creation
indexer = Indexer(llm, embed_model)
index = indexer.create_index(documents)

print("Model and index initialized successfully!")

class AgenticRAG:
    def __init__(self, index):
        self.index = index
        self.hyde = HyDEQueryTransform(include_original=True)

    def trim_to_last_sentence(self, text):
        """Trims the text to the last complete sentence."""
        # Common sentence endings
        endings = ['. ', '! ', '? ']
        # Find the last occurrence of any sentence ending
        last_end = -1
        for end in endings:
            pos = text.rfind(end)
            if pos > last_end:
                last_end = pos

        # If we found a sentence ending, trim to it (including the punctuation)
        if last_end >= 0:
            return text[:last_end + 1].strip()
        # If no sentence endings found, return the original text
        return text.strip()

    def reformulate_query(self, query):
        prompt = PromptTemplate(
            "Given the user query: '{query}'\n"
            "Reformulate it into a more precise and searchable query. "
            "Keep the reformulated query concise and relevant to the original question. "
            "Reformulated query: "
        )
        response = llm.complete(prompt.format(query=query))
        return self.trim_to_last_sentence(response.text.strip())

    def search_and_retrieve(self, query):
        query_engine = self.index.as_query_engine()
        hyde_query = self.hyde(query)
        return query_engine.query(hyde_query)

    def analyze_results(self, results):
        prompt = PromptTemplate(
            "Analyze the following information and extract key points:\n{results}\n"
            "Provide a concise summary of the most relevant information."
        )
        response = llm.complete(prompt.format(results=str(results)))
        return self.trim_to_last_sentence(response.text)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def generate_final_answer(self, context, original_query):
        prompt = PromptTemplate(
            "<|system|>You are a helpful assistant providing accurate information about scientific topics. "
            "Provide clear, well-structured answers based on the given context.<|endoftext|>\n"
            "<|user|>Based on this information:\n{context}\n\n"
            "Please explain: {original_query}<|assistant|>"
        )
        response = llm.complete(prompt.format(
            context=context,
            original_query=original_query
        ))
        return self.trim_to_last_sentence(response.text.strip())

    def clean_results(self, results):
        lines = str(results).split('\n')
        unique_points = []
        seen = set()

        for line in lines:
            line = line.strip()
            if not line or line in seen:
                continue
            seen.add(line)
            unique_points.append(line)

        return self.trim_to_last_sentence('\n'.join(unique_points))

    def process_query(self, initial_query):
        refined_query = self.reformulate_query(initial_query)
        print(f"Refined Query: {refined_query}")

        results = self.search_and_retrieve(refined_query)
        cleaned_results = self.clean_results(results)
        print(f"Retrieved Results: {cleaned_results}")

        final_answer = self.generate_final_answer(cleaned_results, initial_query)
        print(f"Final Answer: {final_answer}")

        return final_answer

app = Flask(__name__)
CORS(app)

agentic_rag = AgenticRAG(index)
print("AgenticRAG initialized successfully!")

@app.route('/process_query', methods=['POST'])
def process_query():
    try:
        if agentic_rag is None:
            return jsonify({"error": "API setup incomplete. Please try again later."}), 503

        # Get the user query from the request
        data = request.json
        if not data or 'user_query' not in data:
            return jsonify({"error": "Missing 'user_query' in request body"}), 400

        user_query = data['user_query']

        # Process the query using AgenticRAG
        response = agentic_rag.process_query(user_query)

        # Return the response
        return jsonify({"query": user_query, "response": response})

    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':

    # Start Flask app
    app.run(host=os.getenv("FLASK_HOST"), port=int(os.getenv("FLASK_PORT")), debug=(os.getenv("FLASK_DEBUG") == "True"))
