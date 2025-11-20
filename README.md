# AI Support Agent Platform

## Overview
This is a comprehensive platform for creating AI support agents equipped with RAG (Retrieval-Augmented Generation) and fine-tuning capabilities. It allows users to upload knowledge base documents, configure custom agents, and interact with them via a chat interface.

## Project Structure
- `backend/`: FastAPI backend application handling API requests, RAG logic, and LLM interactions.
- `frontend/`: Next.js frontend application providing the user interface.
- `ml/`: Machine learning scripts for data logging and fine-tuning (LoRA).
- `infra/`: Infrastructure configurations.

## Features
- **Dashboard**: Central hub to manage agents and view system status.
- **Knowledge Base**: Upload and manage PDF/Docx documents for RAG.
- **Agent Configuration**: Create agents with specific names, system prompts, and models.
- **Chat Interface**: Interact with agents and view citation sources.
- **Fine-tuning Studio**: Monitor and trigger fine-tuning jobs.

## Getting Started

### Prerequisites
- **Node.js** 18+
- **Python** 3.10+
- **OpenAI API Key** (Required for LLM features)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file:
   ```bash
   # Windows (PowerShell)
   New-Item .env -ItemType File
   ```
3. Open `.env` and add your OpenAI API Key:
   ```env
   OPENAI_API_KEY=sk-proj-...
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   The API will be running at `http://localhost:8000`.

### 2. Frontend Setup
1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The UI will be available at `http://localhost:3000`.

### 3. Docker (Optional)
To run the entire stack with Docker Compose:
```bash
docker-compose up --build
```

## Usage Guide

1.  **Upload Knowledge**: Go to the **Knowledge Base** page and upload your PDF documents.
2.  **Create Agent**: Go to **Create New Agent**.
    *   Give your agent a name.
    *   Select a model (Use `gpt-3.5-turbo` if you don't have GPT-4 access).
    *   Select the documents you uploaded.
3.  **Chat**: Start chatting with your agent. It will answer based on the documents you provided.

## Troubleshooting

### Common Issues

*   **"Incorrect API key provided" (401 Error)**:
    *   Ensure your `backend/.env` file has the correct `OPENAI_API_KEY`.
    *   Restart the backend server after changing the `.env` file.

*   **"The model gpt-4 does not exist" (404 Error)**:
    *   Your API key might not have access to GPT-4.
    *   **Solution**: Create a new agent and select **GPT-3.5 Turbo** as the model.

*   **Documents not showing in Agent Config**:
    *   Ensure you have uploaded documents in the "Knowledge Base" section first.
    *   If using the local JSON storage (MVP), ensure `backend/data/documents.json` exists.
