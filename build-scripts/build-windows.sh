#!/bin/bash

# Build script for Windows (x64 and x86)

set -e

ARCH=${1:-x64}

if [ "$ARCH" != "x64" ] && [ "$ARCH" != "x86" ]; then
    echo "Usage: $0 [x64|x86]"
    exit 1
fi

echo "Building Vox Browser for Windows $ARCH..."

cd "$(dirname "$0")/../firefox-custom"

npm install

if [ "$ARCH" = "x64" ]; then
    npm run build-win-x64
else
    npm run build-win-x86
fi

echo "Windows installer built for $ARCH!"

