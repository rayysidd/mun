#source venv/bin/activate
# uvicorn main:app   
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from sentence_transformers import SentenceTransformer
import chromadb
from dotenv import load_dotenv
import google.generativeai as genai

# --- CONFIGURATION & INITIALIZATION ---

dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(dotenv_path=dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

print("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

print("Connecting to local ChromaDB...")
chroma_client = chromadb.PersistentClient(path="chroma_db")
print("ChromaDB connection successful.")

# --- API DATA MODELS ---

class QueryRequest(BaseModel):
    event_id: str
    query_text: str
    top_k: int = 3
    country: Optional[str] = None
    committee: Optional[str] = None
    agenda: Optional[str] = None
    use_rag: bool = True
    # NEW: Accept a list of selected source IDs
    selected_sources: Optional[List[str]] = None

# --- CORE AI FUNCTIONS ---

def is_creative_command(query_text: str) -> bool:
    """Simple intent detection for creative tasks."""
    creative_keywords = ['write', 'draft', 'generate', 'create', 'give me ideas', 'compose', 'speech']
    return any(query_text.lower().startswith(keyword) for keyword in creative_keywords)

# UPDATED: The function now accepts selected_sources for filtering
def search_knowledge_base(event_id: str, query_text: str, top_k: int, selected_sources: List[str] = None):
    """Searches the vector database for the most relevant text chunks, optionally filtering by source."""
    try:
        collection_name = f"event_{event_id}"
        collection = chroma_client.get_collection(name=collection_name)
        query_embedding = model.encode(query_text).tolist()

        # NEW: Build a metadata filter if specific sources are selected
        where_filter = None
        if selected_sources:
            print(f"Filtering search to {len(selected_sources)} selected sources.")
            where_filter = {
                "source_id": {
                    "$in": selected_sources
                }
            }

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter, # Apply the filter here
            include=["metadatas"]
        )
        return results['metadatas'][0] if results and results['metadatas'] else []
    except ValueError:
        return None
    except Exception as e:
        print(f"An unexpected error occurred during search: {e}")
        raise

async def generate_llm_response(prompt: str) -> str:
    """Takes a fully formed prompt and generates a response using the Gemini LLM."""
    try:
        print("Generating response from Gemini...")
        llm = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = await llm.generate_content_async(prompt)
        print("Response generated successfully.")
        return response.text
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return "There was an error communicating with the AI model. Please try again."

# --- API ENDPOINT ---

@app.post("/query")
async def handle_query(request: QueryRequest):
    """
    The main query handler. It now uses a 'use_rag' flag and 'selected_sources' to decide logic path.
    """
    print(f"\nReceived query for event_id: {request.event_id}")
    
    try:
        prompt = ""
        context_chunks = []
        delegate_context = f"You are the delegate of {request.country}. In the {request.committee} committee, discussing the agenda: '{request.agenda}'."

        if request.use_rag:
            print("RAG is enabled. Searching knowledge base...")
            # UPDATED: Pass the selected_sources to the search function
            context_chunks = search_knowledge_base(
                event_id=request.event_id,
                query_text=request.query_text,
                top_k=request.top_k,
                selected_sources=request.selected_sources
            )

            if context_chunks is None:
                raise HTTPException(status_code=404, detail=f"Knowledge base for event '{request.event_id}' not found.")
            
            is_creative = is_creative_command(request.query_text)
            context_str = "\n\n".join([chunk['text'] for chunk in context_chunks])

            if context_chunks:
                if is_creative:
                    prompt = f"{delegate_context} Your task is to: '{request.query_text}'. Use the following provided context as the primary source of facts and evidence. Creatively weave this information into your answer, using your general knowledge to make it fluent and persuasive.\n\nCONTEXT:\n---\n{context_str}\n---"
                else:
                    prompt = f"You are an expert Model UN assistant. Your primary task is to answer the user's question using the provided context. Synthesize the information from the context to form a direct and factual answer. If you use your general knowledge to add clarifying details, explicitly state, 'From my general knowledge...'.\n\nCONTEXT:\n---\n{context_str}\n---\n\nUSER'S QUESTION:\n{request.query_text}"
            else:
                prompt = f"You are an expert Model UN assistant. You were unable to find any relevant information in the user's provided knowledge sources for the query: '{request.query_text}'. Therefore, you must answer using your own general knowledge.\n\nCrucially, you MUST begin your answer with the following warning: '***Warning: The following information is from my general knowledge and has not been verified by the sources in your event's knowledge base.***'"

        else:
            print("RAG is disabled. Using general knowledge only.")
            prompt = f"{delegate_context} Your task is to: '{request.query_text}'. You must use your general knowledge to fulfill this request."

        final_answer = await generate_llm_response(prompt)
        
        print(f"Final answer prepared. Returning to client.")
        
        return {
            "success": True,
            "final_answer": final_answer,
            "retrieved_context": context_chunks
        }

    except Exception as e:
        print(f"!!! FAILED to handle query: {e} !!!")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@app.get("/")
def read_root():
    return {"status": "AI Service is running"}
