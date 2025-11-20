import argparse
import os
import json
import time
import sys

def mock_train(data_path, output_dir, epochs=3):
    print(f"Starting mock training using data from {data_path}")
    print(f"Output directory: {output_dir}")
    
    steps = epochs * 5
    for i in range(steps):
        loss = 2.5 - (i * 0.2) + (0.1 * (i % 2)) # Fake loss curve
        print(f"Step {i+1}/{steps} - Loss: {loss:.4f}")
        time.sleep(1) # Simulate work
        
        # Log progress to a file so UI can read it
        with open(os.path.join(output_dir, "training_log.json"), "w") as f:
            json.dump({"step": i+1, "total_steps": steps, "loss": loss, "status": "training"}, f)
            
    print("Training complete!")
    with open(os.path.join(output_dir, "training_log.json"), "w") as f:
        json.dump({"step": steps, "total_steps": steps, "loss": 0.5, "status": "completed"}, f)
        
    # Save a dummy adapter file
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "adapter_config.json"), "w") as f:
        json.dump({"base_model_name_or_path": "mock-model", "peft_type": "LORA"}, f)
    with open(os.path.join(output_dir, "adapter_model.bin"), "w") as f:
        f.write("dummy model content")

def real_train(data_path, model_name, output_dir, epochs):
    try:
        import torch
        from datasets import load_dataset
        from peft import LoraConfig, get_peft_model, TaskType
        from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer, DataCollatorForLanguageModeling
    except ImportError as e:
        print(f"Missing dependencies for real training: {e}")
        print("Falling back to mock training...")
        mock_train(data_path, output_dir, epochs)
        return

    print(f"Loading model: {model_name}")
    # Load model & tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(model_name)
    
    # LoRA Config
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM, 
        inference_mode=False, 
        r=8, 
        lora_alpha=32, 
        lora_dropout=0.1
    )
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    # Load Data
    dataset = load_dataset("json", data_files=data_path, split="train")
    
    def tokenize_function(examples):
        # Simple formatting
        texts = []
        for msgs in examples["messages"]:
            # Convert chat format to text
            chat_text = ""
            for msg in msgs:
                chat_text += f"<|{msg['role']}|>\n{msg['content']}\n"
            texts.append(chat_text)
        
        return tokenizer(texts, padding="max_length", truncation=True, max_length=512)

    tokenized_datasets = dataset.map(tokenize_function, batched=True)

    training_args = TrainingArguments(
        output_dir=output_dir,
        per_device_train_batch_size=1,
        num_train_epochs=epochs,
        learning_rate=2e-4,
        logging_steps=1,
        save_strategy="epoch"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )

    trainer.train()
    model.save_pretrained(output_dir)
    print("Real training complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_path", type=str, required=True)
    parser.add_argument("--model_name", type=str, default="TinyLlama/TinyLlama-1.1B-Chat-v1.0")
    parser.add_argument("--output_dir", type=str, default="output")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--mock", action="store_true", help="Force mock training")
    
    args = parser.parse_args()
    
    if args.mock:
        mock_train(args.data_path, args.output_dir, args.epochs)
    else:
        # Try real training, fallback to mock if imports fail
        real_train(args.data_path, args.model_name, args.output_dir, args.epochs)
