#!/usr/bin/env bash
# Vox Unified Installer: Pre-setup, Install, Post-setup
set -e

# --- Pre-Setup: Welcome, Terms, AI Model Choice ---
clear
echo "==============================="
echo "   Vox Browser Installer"
echo "==============================="
echo
read -p "Press Enter to continue..."

# Terms and Conditions
cat <<EOM
By installing Vox, you agree to:
- Use open-source LLMs for local inference only
- Accept that large models require significant disk and RAM
- No data is sent to any cloud by default
- You are responsible for your own privacy and compliance
EOM
read -p "Type 'yes' to accept and continue: " agree
if [[ "$agree" != "yes" ]]; then
  echo "You must accept the terms to continue."; exit 1;
fi


# AI Model Selection (with No AI and Custom)
MODELS=(
  "No AI assistant (skip all AI setup)"
  "TinyLlama-1.1B-Chat (0.5GB RAM, 0.5GB disk)"
  "Phi-2 2.7B (1.5GB RAM, 2GB disk)"
  "Mistral-7B-Instruct (4GB RAM, 4GB disk)"
  "Custom GGUF model (enter URL)"
)
MODEL_URLS=(
  "NOAI"
  "https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
  "https://huggingface.co/microsoft/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf"
  "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
  "CUSTOM"
)
MODEL_FILES=(
  "NOAI"
  "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
  "phi-2.Q4_K_M.gguf"
  "mistral-7b-instruct-v0.2.Q4_K_M.gguf"
  "custom_model.gguf"
)

clear
echo "Choose your local AI model:"
for i in "${!MODELS[@]}"; do
  echo "  $((i+1)). ${MODELS[$i]}"
done
read -p "Enter number [1-${#MODELS[@]}]: " model_idx
model_idx=$((model_idx-1))
if [[ $model_idx -lt 0 || $model_idx -ge ${#MODELS[@]} ]]; then
  echo "Invalid selection."; exit 1;
fi
MODEL_URL="${MODEL_URLS[$model_idx]}"
MODEL_FILE="${MODEL_FILES[$model_idx]}"
if [[ "$MODEL_URL" == "CUSTOM" ]]; then
  read -p "Enter direct GGUF model URL: " MODEL_URL
  read -p "Enter filename to save as (e.g. mymodel.gguf): " MODEL_FILE
fi


# --- Install Dependencies ---
echo "\nInstalling dependencies..."
sudo apt-get update
sudo apt-get install -y git build-essential python3 python3-pip curl cmake libcurl4-openssl-dev

if [[ "$MODEL_URL" != "NOAI" ]]; then

  # --- Install llama.cpp (CMake build) ---
  if [ ! -d "llama.cpp" ]; then
    git clone https://github.com/ggerganov/llama.cpp.git
  fi
  cd llama.cpp
  mkdir -p build
  cd build
  cmake ..
  cmake --build . --config Release -j $(nproc)
  cd ../..

  # --- Download Model ---
  MODEL_DIR="llama.cpp/models"
  mkdir -p "$MODEL_DIR"
  echo "\nDownloading model: $MODEL_FILE..."
  curl -L "$MODEL_URL" -o "$MODEL_DIR/$MODEL_FILE"

  # --- Setup LLM API ---
  API_DIR="llama.cpp/api"
  mkdir -p "$API_DIR"
  cat > "$API_DIR/vox_llm_api.py" <<EOF
from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)
MODEL_PATH = os.path.abspath("../models/$MODEL_FILE")
LLAMA_BIN = os.path.abspath("../main")

@app.route('/api/llm', methods=['POST'])
def llm():
  prompt = request.json.get('prompt', '')
  if not prompt:
    return jsonify({'error': 'No prompt'}), 400
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

  pip3 install flask
fi

# --- Post-Setup: UI/Browser Preferences ---
clear
echo "\nVox Browser UI Preferences:"
echo "Tab layout:"
echo "  1. Vertical (default)"
echo "  2. Horizontal"
read -p "Choose [1-2]: " tab_layout
if [[ "$tab_layout" == "2" ]]; then
  TAB_LAYOUT="horizontal"
else
  TAB_LAYOUT="vertical"
fi

echo "Theme:"
echo "  1. Dark (default)"
echo "  2. Light"
read -p "Choose [1-2]: " theme
if [[ "$theme" == "2" ]]; then
  THEME="light"
else
  THEME="dark"
fi

echo "Search engine:"
echo "  1. DuckDuckGo (default)"
echo "  2. Startpage"
echo "  3. Brave Search"
read -p "Choose [1-3]: " search
case "$search" in
  2) SEARCH="https://www.startpage.com/do/dsearch?query=";;
  3) SEARCH="https://search.brave.com/search?q=";;
  *) SEARCH="https://duckduckgo.com/?q=";;
esac

USERJS_DIR="firefox-115.0/browser/app/profile"
mkdir -p "$USERJS_DIR"
# Write user.js with preferences
cat > "$USERJS_DIR/user.js" <<EOP
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("userChrome.vox-tab-layout", "$TAB_LAYOUT");
user_pref("userChrome.vox-theme", "$THEME");
user_pref("browser.startup.homepage", "file://$(pwd)/firefox-115.0/browser/app/profile/defaults/vox_start.html");
user_pref("browser.search.defaultenginename", "$SEARCH");
EOP

clear
echo "\n==============================="
echo " Vox Browser is ready!"
echo "==============================="
echo "To start the local AI server:"
echo "  cd llama.cpp/api && python3 vox_llm_api.py"
echo "Then launch the browser."
echo
