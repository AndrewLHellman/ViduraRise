import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from llama_index.llms.huggingface import HuggingFaceLLM
from langchain_community.embeddings import HuggingFaceEmbeddings

class ModelLoader:
    """Loads the LLM model, tokenizer, and embedding model."""
    def __init__(self, model_name, quantization_config=None, max_tokens=256, temperature=0.1, top_k=40, top_p=0.95):
        self.model_name = model_name
        self.quantization_config = quantization_config
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.top_k = top_k
        self.top_p = top_p

    def load_model_and_tokenizer(self):
        max_memory = {
            0: "2GiB",
            "cpu": "12GiB"
        }

        tokenizer = AutoTokenizer.from_pretrained(self.model_name)

        model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            device_map="auto",
            low_cpu_mem_usage=True,
            torch_dtype=torch.float16,
            quantization_config=self.quantization_config,
            max_memory=max_memory,
            offload_folder="offload_folder",
            offload_state_dict=True
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

    def load_embedding_model(self, embedding_model_name="sentence-transformers/all-MiniLM-L6-v2"):
        return HuggingFaceEmbeddings(model_name=embedding_model_name)
