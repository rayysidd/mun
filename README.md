DiploMate 🏛️
AI-Powered Model UN Strategy Platform
DiploMate is a full-stack, collaborative web application designed to be a comprehensive research and strategy partner for Model United Nations (MUN) participants. It moves beyond simple speech generation by allowing users to create event-specific workspaces, build shared knowledge bases from external sources, and query that knowledge using a sophisticated Retrieval-Augmented Generation (RAG) pipeline to get factually grounded, context-aware answers.

✨ Key Features
Event-Based Workspaces: Create and join secure MUN events with unique passcodes. Each event is a self-contained workspace.

Collaborative Knowledge Base: Add knowledge sources (URLs or pasted text) to an event. These sources form a curated knowledge base for the AI.

RAG-Powered AI Assistant: A real-time chat interface where users can query the AI. The AI uses the event's specific knowledge base to provide factually grounded answers, minimizing hallucinations.

Dynamic Prompt Engineering: The AI intelligently detects user intent (factual question vs. creative command) and tailors its response strategy accordingly.

User-Controlled Context: Users can toggle whether the AI uses the knowledge base (RAG) or its own general knowledge. They can also manually select specific sources to focus the AI's attention.

Speech Generation Integration: Autofill the speech writer form with event context, and use the AI to find and add factual context directly from the knowledge base.

Persistent Memory: Save valuable AI responses as new sources, creating a powerful feedback loop where the AI's best outputs become part of its future knowledge.

🛠️ Tech Stack & Architecture
DiploMate uses a hybrid, microservice-based architecture to leverage the strengths of different technology ecosystems.

graph TD
    A[Next.js Frontend] -->|API Calls| B(Node.js/Express Backend);
    B -->|CRUD Ops| C[MongoDB Atlas];
    B -->|Proxy AI Queries| D(Python/FastAPI AI Service);
    D -->|Similarity Search| E[ChromaDB Vector Store];
    D -->|Generate Response| F[Gemini API];
    G[Python Ingestion Service] -->|Reads Sources| C;
    G -->|Writes Embeddings| E;

    subgraph User's Browser
        A
    end

    subgraph Main Server
        B
        C
    end

    subgraph AI Microservice
        D
        E
        G
    end

Frontend: Next.js, React, TypeScript, Tailwind CSS

Backend (Main API): Node.js, Express.js, MongoDB (with Mongoose), JWT for authentication.

Backend (AI Service):

API: Python, FastAPI

AI/ML: sentence-transformers (for embeddings), nltk (for chunking), google-generativeai (for LLM generation)

Databases: ChromaDB (for local vector storage), pymongo (to connect to MongoDB)

🚀 Getting Started
Follow these instructions to get the project running locally.

Prerequisites
Node.js (v18 or later)

Python (v3.9 or later)

A MongoDB Atlas account and a connection string (URI).

A Google Gemini API Key.

1. Clone the Repository
git clone <your-repo-url>
cd mun

2. Setup the Backend (Node.js)
Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file and add your secrets:

MONGODB_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="a_strong_secret_key_for_jwt"
GEMINI_API_KEY="your_google_gemini_api_key"

Run the backend server (this will run on http://localhost:5001):

npm run dev

3. Setup the AI Service (Python)
Open a new terminal. Navigate to the project's root (mun) directory.

Create and activate a Python virtual environment:

cd server-python
python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

In this terminal, run the ingestion service (this will run in the background):

python ingestion_service.py

Open a third terminal. Navigate to the project root (mun) and activate the virtual environment again.

Run the API server (this will run on http://localhost:8000):

uvicorn server-python.main:app --reload

4. Setup the Frontend (Next.js)
Open a fourth terminal. Navigate to the project's root (mun) directory.

Install dependencies:

npm install

Run the frontend development server (this will run on `http
