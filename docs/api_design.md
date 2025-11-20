# API Design

## Overview
This document defines the REST API endpoints for the AI Support Agent platform.

## Endpoints

### 1. Documents (Knowledge Base)

#### Upload Document
- **POST** `/api/v1/documents/upload`
- **Description**: Upload a file (PDF, DOCX, TXT) to the knowledge base.
- **Request**: `multipart/form-data`
    - `file`: File object
- **Response**:
    ```json
    {
        "id": "doc_123",
        "filename": "policy.pdf",
        "status": "processing"
    }
    ```

#### List Documents
- **GET** `/api/v1/documents`
- **Description**: List all uploaded documents.
- **Response**:
    ```json
    [
        {
            "id": "doc_123",
            "filename": "policy.pdf",
            "status": "indexed",
            "created_at": "2023-10-27T10:00:00Z"
        }
    ]
    ```

#### Delete Document
- **DELETE** `/api/v1/documents/{doc_id}`
- **Description**: Delete a document and its embeddings.

### 2. Agents

#### Create Agent
- **POST** `/api/v1/agents`
- **Description**: Create a new AI agent configuration.
- **Request**:
    ```json
    {
        "name": "HR Support",
        "model": "gpt-4",
        "system_prompt": "You are a helpful HR assistant...",
        "tools": ["time_off_lookup"],
        "document_ids": ["doc_123"]
    }
    ```
- **Response**:
    ```json
    {
        "id": "agent_456",
        "name": "HR Support",
        ...
    }
    ```

#### List Agents
- **GET** `/api/v1/agents`
- **Description**: List all agents.

#### Get Agent
- **GET** `/api/v1/agents/{agent_id}`
- **Description**: Get details of a specific agent.

#### Update Agent
- **PUT** `/api/v1/agents/{agent_id}`
- **Description**: Update an agent's configuration.

### 3. Chat

#### Send Message
- **POST** `/api/v1/chat`
- **Description**: Send a message to an agent and get a response.
- **Request**:
    ```json
    {
        "agent_id": "agent_456",
        "message": "How do I request time off?",
        "history": [] // Optional chat history
    }
    ```
- **Response**:
    ```json
    {
        "response": "You can request time off by...",
        "citations": [
            {
                "document_id": "doc_123",
                "text": "Employees can request time off...",
                "score": 0.89
            }
        ],
        "tool_calls": []
    }
    ```

### 4. Tools (Internal)
- **GET** `/api/v1/tools`
- **Description**: List available tools that can be enabled for an agent.
