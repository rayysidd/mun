import os
import time
import pymongo
import requests
import nltk
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
import chromadb
from dotenv import load_dotenv

# --- CONFIGURATION ---
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(dotenv_path=dotenv_path)

MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI not found in environment variables.")

DB_NAME = "test"
SOURCES_COLLECTION = "sources"
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'

# --- INITIALIZATION ---

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Downloading 'punkt' for NLTK sentence tokenization...")
    nltk.download('punkt')
    print("Download complete.")

print(f"Loading sentence transformer model: {EMBEDDING_MODEL}...")
model = SentenceTransformer(EMBEDDING_MODEL)
print("Model loaded.")

print(f"Connecting to MongoDB...")
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
sources_collection = db[SOURCES_COLLECTION]
print("MongoDB connected.")

chroma_client = chromadb.PersistentClient(path="chroma_db")
def get_chroma_collection(event_id):
    return chroma_client.get_or_create_collection(name=f"event_{event_id}")

# --- CORE FUNCTIONS ---

def scrape_url_content(url: str) -> str:
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        paragraphs = soup.find_all('p')
        content = ' '.join([p.get_text() for p in paragraphs])
        return content
    except requests.RequestException as e:
        print(f"Error scraping URL {url}: {e}")
        return None

def chunk_text(text: str, chunk_size: int = 5) -> list[str]:
    """Splits a long text into smaller chunks of a few sentences."""
    # CORRECTED: Added a full try-except block for robust tokenization.
    try:
        if len(text.split()) < 20:
            return [text]
            
        sentences = nltk.sent_tokenize(text)
        chunks = [' '.join(sentences[i:i + chunk_size]) for i in range(0, len(sentences), chunk_size)]
        return chunks
    except Exception as e:
        print(f"NLTK tokenization failed: {e}. Falling back to paragraph splitting.")
        # Fallback for when NLTK fails: split by double newlines (paragraphs)
        chunks = [chunk for chunk in text.split('\n\n') if chunk.strip()]
        return chunks if chunks else [text] # Ensure we always return at least one chunk

def update_source_status(source_id, status: str, error_message: str = None):
    update_data = {'$set': {'status': status}}
    if error_message:
        update_data['$set']['errorMessage'] = error_message
    sources_collection.update_one({'_id': source_id}, update_data)

# --- MAIN PROCESSING LOOP ---

def process_pending_sources():
    print("\nChecking for pending sources...")
    pending_sources = list(sources_collection.find({'status': 'pending'}))
    
    if not pending_sources:
        print("No pending sources found.")
        return

    for source in pending_sources:
        source_id = source['_id']
        event_id = str(source['eventId'])
        print(f"\n--- Processing source: {source['title']} (ID: {source_id}) ---")
        
        try:
            update_source_status(source_id, 'processing')
            
            text_content = None
            source_type = source.get('type', 'url') # Default to 'url' for safety

            if source_type == 'url':
                print(f"Scraping URL: {source['content']}")
                text_content = scrape_url_content(source['content'])
                if not text_content:
                    raise ValueError("Failed to scrape any content from the URL.")
                print(f"Scraped {len(text_content)} characters of text.")
            
            elif source_type == 'text':
                print("Processing direct text source.")
                text_content = source['content']
                if not text_content:
                    raise ValueError("Source content is empty.")
                print(f"Loaded {len(text_content)} characters of text.")
            
            else:
                raise ValueError(f"Unsupported source type: {source_type}")

            text_chunks = chunk_text(text_content)
            print(f"Split content into {len(text_chunks)} chunks.")

            print("Creating embeddings for chunks...")
            embeddings = model.encode(text_chunks).tolist()
            print(f"Created {len(embeddings)} embeddings.")

            chroma_collection = get_chroma_collection(event_id)
            chunk_ids = [f"{source_id}_{i}" for i in range(len(text_chunks))]
            metadatas = [{'source_id': str(source_id), 'text': chunk} for chunk in text_chunks]

            chroma_collection.add(
                embeddings=embeddings,
                metadatas=metadatas,
                ids=chunk_ids
            )
            print(f"Stored {len(chunk_ids)} chunks in ChromaDB collection for event {event_id}.")

            update_source_status(source_id, 'completed')
            print(f"--- Successfully processed source {source_id} ---")

        except Exception as e:
            print(f"!!! FAILED to process source {source_id}: {e} !!!")
            update_source_status(source_id, 'failed', str(e))


if __name__ == "__main__":
    print("Starting Ingestion Service. Press Ctrl+C to stop.")
    while True:
        process_pending_sources()
        time.sleep(60)
