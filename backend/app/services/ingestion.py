import os
from typing import List
from fastapi import UploadFile
import fitz  # PyMuPDF
# import docx

class IngestionService:
    def __init__(self):
        pass

    async def process_file(self, file: UploadFile) -> str:
        """
        Extract text from uploaded file.
        """
        content = await file.read()
        filename = file.filename.lower()
        
        if filename.endswith(".pdf"):
            return self._extract_from_pdf(content)
        elif filename.endswith(".txt"):
            return content.decode("utf-8")
        # Add docx support later
        else:
            raise ValueError("Unsupported file type")

    def _extract_from_pdf(self, content: bytes) -> str:
        doc = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """
        Simple chunking strategy.
        """
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - overlap
        return chunks

ingestion_service = IngestionService()
