import chromadb
import pprint # Used for pretty-printing the output

# --- CONFIGURATION ---
# This must match the path used in your ingestion service
CHROMA_DB_PATH = "chroma_db"

def verify_collection_content():
    """Connects to ChromaDB and prints the contents of a specific event collection."""
    
    print("Connecting to local ChromaDB...")
    try:
        client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        print("Connection successful.")
    except Exception as e:
        print(f"Failed to connect to ChromaDB: {e}")
        return

    # Get the event ID from the user
    event_id = input("Please enter the event ID you want to check: ").strip()
    if not event_id:
        print("No event ID provided. Exiting.")
        return
        
    collection_name = f"event_{event_id}"
    
    try:
        print(f"\nAttempting to get collection: '{collection_name}'...")
        collection = client.get_collection(name=collection_name)
        print("Collection found.")
    except ValueError:
        print(f"Error: A collection with the name '{collection_name}' was not found.")
        print("Please make sure the event ID is correct and the ingestion service has processed a source for it.")
        return
        
    # Get all items from the collection
    # The include parameter specifies which parts of the data we want to see
    results = collection.get(include=["metadatas", "embeddings"])
    
    item_count = len(results['ids'])
    print(f"\nFound {item_count} item(s) in the collection.")
    
    if item_count > 0:
        print("\n--- Verifying Collection Content ---")
        # Loop through and print each item for clarity
        for i in range(item_count):
            print(f"\n--- Item {i+1} ---")
            print(f"ID: {results['ids'][i]}")
            
            print("\nMetadata (the original text chunk):")
            pprint.pprint(results['metadatas'][i])
            
            # We only print the first 5 numbers of the embedding for brevity
            embedding_preview = results['embeddings'][i][:5]
            print(f"\nEmbedding (first 5 dimensions of {len(results['embeddings'][i])}):")
            pprint.pprint(embedding_preview)
            print("...")
        print("\n--- Verification Complete ---")
    
if __name__ == "__main__":
    verify_collection_content()
