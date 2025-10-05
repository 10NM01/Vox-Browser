#!/usr/bin/env bash
# Vox AI Assistant Installer Script
# Installs llama.cpp and downloads a default LLM for local inference
set -e

# Check dependencies
if ! command -v git >/dev/null; then
  echo "Please install git first."; exit 1;
fi
if ! command -v g++ >/dev/null; then
  echo "Please install build-essential (g++)."; exit 1;
fi
if ! command -v python3 >/dev/null; then
  echo "Please install python3."; exit 1;
fi
if ! command -v curl >/dev/null; then
  echo "Please install curl."; exit 1;
fi

# Install llama.cpp
if [ ! -d "llama.cpp" ]; then
  git clone https://github.com/ggerganov/llama.cpp.git
fi
cd llama.cpp
make -j$(nproc)
cd ..

# Download a small open LLM (e.g., TinyLlama)
MODEL_DIR="llama.cpp/models"
mkdir -p "$MODEL_DIR"
MODEL_URL="https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
MODEL_FILE="$MODEL_DIR/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
if [ ! -f "$MODEL_FILE" ]; then
  echo "Downloading TinyLlama..."
  curl -L "$MODEL_URL" -o "$MODEL_FILE"
fi

# Create a simple local API server (Python Flask)
API_DIR="llama.cpp/api"
mkdir -p "$API_DIR"
cat > "$API_DIR/vox_llm_api.py" <<EOF
from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)
MODEL_PATH = os.path.abspath("../models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf")
LLAMA_BIN = os.path.abspath("../main")

@app.route('/api/llm', methods=['POST'])
def llm():
    prompt = request.json.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'No prompt'}), 400
    # Run llama.cpp with prompt
    proc = subprocess.Popen([
        LLAMA_BIN, '-m', MODEL_PATH, '-p', prompt, '-n', '128', '--temp', '0.7', '--top_k', '40', '--top_p', '0.95', '--repeat_penalty', '1.1', '--color', 'never', '--silent-prompt'
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = proc.communicate(timeout=60)
    if proc.returncode != 0:
        return jsonify({'error': err.decode()}), 500
    return jsonify({'response': out.decode().strip()})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8088)
EOF

# Install Python dependencies
pip3 install flask

# Print instructions
cat <<EOM

Vox AI Assistant is ready!
To start the local LLM API server, run:
  cd llama.cpp/api && python3 vox_llm_api.py

The browser will connect to http://127.0.0.1:8088/api/llm for local AI chat.
EOM
