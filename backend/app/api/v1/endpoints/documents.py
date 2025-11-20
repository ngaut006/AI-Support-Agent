from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.services.ingestion import ingestion_service
from app.services.vector_store import vector_store
from app.services.embedding import embedding_service
import uuid
import os
import json
from pathlib import Path

router = APIRouter()

# Simple JSON persistence for MVP
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
DOCS_FILE = DATA_DIR / "documents.json"

def load_docs():
    if not DOCS_FILE.exists():
        return []
    try:
        with open(DOCS_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_docs(docs):
    with open(DOCS_FILE, "w") as f:
        json.dump(docs, f, indent=2)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # 1. Extract text
        text = await ingestion_service.process_file(file)
        
        # 2. Chunk text
        chunks = ingestion_service.chunk_text(text)
        
        # 3. Embed chunks
        embeddings = embedding_service.get_embeddings(chunks)
        
        # 4. Store in Vector DB
        doc_id = str(uuid.uuid4())
        ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
        metadatas = [{"doc_id": doc_id, "filename": file.filename, "chunk_index": i} for i in range(len(chunks))]
        
        vector_store.add_documents(
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )
        
        # 5. Save metadata to JSON
        doc_info = {
            "id": doc_id, 
            "filename": file.filename, 
            "status": "indexed", 
            "chunks": len(chunks),
            "uploaded_at": str(os.path.getmtime(file.file.fileno()) if hasattr(file.file, 'fileno') else 0)
        }
        
        docs = load_docs()
        docs.append(doc_info)
        save_docs(docs)
        
        return doc_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_documents():
    return load_docs()

@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    try:
        # Delete from Vector DB
        vector_store.delete_document(doc_id)
        
        # Delete from JSON
        docs = load_docs()
        docs = [d for d in docs if d["id"] != doc_id]
        save_docs(docs)
        
        return {"status": "deleted", "id": doc_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
