#!/usr/bin/env bash
# Vox All-in-One Installer & Launcher
set -e

VOX_LOGO=''
VOX_LOGO+="\n\e[1;35m" # Magenta bold
VOX_LOGO+="      __     \n"
VOX_LOGO+=" __  / /_  __\n"
VOX_LOGO+="/ /_/ / / / / \n"
VOX_LOGO+="\____/_/ /_/  \n"
VOX_LOGO+="\e[0m" # Reset

clear
echo -e "$VOX_LOGO"
echo "==============================="
echo "         Vox Browser"
echo "==============================="
echo

# Run the unified installer script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/vox_installer.sh"

# Optionally, launch browser or AI server after install
read -p "Do you want to start the local AI server now? [y/N]: " start_ai
if [[ "$start_ai" =~ ^[Yy]$ ]]; then
  cd "$SCRIPT_DIR/../llama.cpp/api" && python3 vox_llm_api.py &
  echo "Vox AI server started in background."
fi

echo "You can now launch Vox Browser from the application menu or by running the browser binary."
