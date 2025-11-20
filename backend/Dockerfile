FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for PyMuPDF and others
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# If requirements.txt doesn't exist, we can install directly or create it.
# For now, let's assume we need to generate it or install manually in the dockerfile.
# Better approach: Copy pyproject.toml if using poetry, or just install what we know we need.
RUN pip install --no-cache-dir fastapi uvicorn[standard] python-multipart openai chromadb pymupdf pydantic-settings

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
