from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.node_parser import SentenceSplitter

class Indexer:
    """Creates an index from the loaded documents."""
    def __init__(self, llm, embed_model, chunk_size=1024, chunk_overlap=20):
        self.llm = llm
        self.embed_model = embed_model
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def create_index(self, documents):
        Settings.llm = self.llm
        Settings.embed_model = self.embed_model
        Settings.node_parser = SentenceSplitter(chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        return VectorStoreIndex.from_documents(documents)
