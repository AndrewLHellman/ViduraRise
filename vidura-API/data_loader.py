from llama_index.core import SimpleDirectoryReader

class DataLoader:
    """Handles loading research papers from the given directory."""
    def __init__(self, directory_path):
        self.directory_path = directory_path

    def load_documents(self):
        return SimpleDirectoryReader(self.directory_path).load_data()
