#!/usr/bin/env bash
# Vox Browser Post-Install Script
# Ensures all dependencies for local AI and browser features are present
set -e

# Install system dependencies
sudo apt-get update
sudo apt-get install -y git build-essential python3 python3-pip curl

# Run AI installer
cd "$(dirname "$0")"
./vox_ai_install.sh
