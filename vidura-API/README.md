# VIDURA Research Assistant

This is the backend API for the VIDURA research assistant, powered by a Retrieval Augmented Generation (RAG) system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure you have a `.env` file with the necessary configuration (see `.env.example`).

3. Start the Flask server:
```bash
python ARES.py
```

## API Endpoints

- `POST /process_query`: Process a research query
  - Request body: `{ "user_query": "Your research question here" }`
  - Response: `{ "query": "Original query", "response": "AI-generated response" }`

## Integration with Frontend

The frontend chatbot connects to this API to provide research assistance to users. The chatbot can be found in:
- `/RISE_Fullstack/frontend/src/Pages/ChatBot.js`
- `/RISE_Fullstack/frontend/src/Pages/chat_bot/`

To use the chatbot, simply:
1. Start this backend server (`python ARES.py`)
2. Start the frontend application (`cd RISE_Fullstack/frontend && npm start`)
3. Navigate to the appropriate page in the frontend application