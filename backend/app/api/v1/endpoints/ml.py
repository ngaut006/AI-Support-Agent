from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
import subprocess
import os
import json
import sys

router = APIRouter()

TRAINING_SCRIPT = os.path.join(os.getcwd(), "..", "ml", "training", "train_lora.py")
DATA_PATH = os.path.join(os.getcwd(), "..", "ml", "data", "raw", "chat_logs.jsonl")
OUTPUT_DIR = os.path.join(os.getcwd(), "..", "ml", "training", "output")

class TrainRequest(BaseModel):
    epochs: int = 3
    model_name: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    mock: bool = False

def run_training(epochs: int, model_name: str, mock: bool):
    cmd = [
        sys.executable, 
        TRAINING_SCRIPT,
        "--data_path", DATA_PATH,
        "--model_name", model_name,
        "--output_dir", OUTPUT_DIR,
        "--epochs", str(epochs)
    ]
    if mock:
        cmd.append("--mock")
        
    # Run in background
    with open(os.path.join(OUTPUT_DIR, "process.log"), "w") as log_file:
        subprocess.Popen(cmd, stdout=log_file, stderr=log_file)

@router.post("/train")
async def start_training(request: TrainRequest, background_tasks: BackgroundTasks):
    # Ensure output dir exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Check if data exists
    if not os.path.exists(DATA_PATH):
        # Create dummy data if not exists for demo
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        with open(DATA_PATH, "w") as f:
            f.write(json.dumps({"messages": [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hello"}]}) + "\n")

    background_tasks.add_task(run_training, request.epochs, request.model_name, request.mock)
    return {"status": "started", "message": "Training started in background"}

@router.get("/status")
async def get_training_status():
    log_file = os.path.join(OUTPUT_DIR, "training_log.json")
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            try:
                return json.load(f)
            except:
                return {"status": "unknown"}
    return {"status": "idle"}
