from datetime import datetime
from llama_index.core.prompts import PromptTemplate
from llama_index.core.query_engine import RetryQueryEngine
from llama_index.core.indices.query.query_transform import HyDEQueryTransform
from tenacity import retry, stop_after_attempt, wait_exponential

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

    def process_query(self, initial_query, user_id):
        refined_query = self.reformulate_query(initial_query)
        print(f"Refined Query: {refined_query}")

        results = self.search_and_retrieve(refined_query)
        cleaned_results = self.clean_results(results)
        print(f"Retrieved Results: {cleaned_results}")

        final_answer = self.generate_final_answer(cleaned_results, initial_query)
        print(f"Final Answer: {final_answer}")

        # Store chat in MongoDB
        self.store_chat(user_id, initial_query, final_answer)

        return final_answer

    def store_chat(self, user_id, query, response):
        """Stores the chat interaction in MongoDB"""
        timestamp = datetime.now()

        chat_entry = {
            "query": query,
            "response": response,
            "timestamp": timestamp
        }

        # Try to find the user and update their chat history
        result = users_collection.update_one(
            {"user_id": user_id},
            {"$push": {"chat_history": chat_entry}},
            upsert=False
        )

        # If user doesn't exist, create a new user document
        if result.matched_count == 0:
            users_collection.insert_one({
                "user_id": user_id,
                "created_at": timestamp,
                "chat_history": [chat_entry]
            })
