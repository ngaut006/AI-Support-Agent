import sqlite3
import uuid
from typing import List, Dict, Optional
from pathlib import Path
import json
from datetime import datetime

class ChatStorageService:
    def __init__(self, db_path: str = "data/chat.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(exist_ok=True)
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        conn = self._get_conn()
        cursor = conn.cursor()
        
        # Create sessions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                agent_id TEXT NOT NULL,
                title TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create messages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions (id)
            )
        """)
        
        conn.commit()
        conn.close()

    def create_session(self, agent_id: str, title: Optional[str] = None) -> str:
        session_id = str(uuid.uuid4())
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO sessions (id, agent_id, title) VALUES (?, ?, ?)",
            (session_id, agent_id, title)
        )
        conn.commit()
        conn.close()
        return session_id

    def add_message(self, session_id: str, role: str, content: str):
        message_id = str(uuid.uuid4())
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)",
            (message_id, session_id, role, content)
        )
        conn.commit()
        conn.close()
        return message_id

    def get_session_history(self, session_id: str) -> List[Dict]:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC",
            (session_id,)
        )
        rows = cursor.fetchall()
        conn.close()
        
        return [
            {"role": row[0], "content": row[1], "created_at": row[2]}
            for row in rows
        ]

    def get_agent_sessions(self, agent_id: str) -> List[Dict]:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, title, created_at FROM sessions WHERE agent_id = ? ORDER BY created_at DESC",
            (agent_id,)
        )
        rows = cursor.fetchall()
        conn.close()
        
        return [
            {"id": row[0], "title": row[1], "created_at": row[2]}
            for row in rows
        ]

chat_storage = ChatStorageService()
