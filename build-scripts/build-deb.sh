#!/bin/bash

# Build script for Debian packages (arm64 and amd64)

set -e

ARCH=${1:-amd64}

if [ "$ARCH" != "amd64" ] && [ "$ARCH" != "arm64" ]; then
    echo "Usage: $0 [amd64|arm64]"
    exit 1
fi

echo "Building Vox Browser DEB package for $ARCH..."

cd "$(dirname "$0")/../firefox-custom"

npm install

if [ "$ARCH" = "amd64" ]; then
    npm run build-deb-amd64
else
    npm run build-deb-arm64
fi

echo "DEB package built for $ARCH!"

