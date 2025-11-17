#!/bin/bash

# Build script for Vox Browser - All platforms and architectures

set -e

echo "Building Vox Browser for all platforms..."

cd "$(dirname "$0")/../firefox-custom"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build for Windows (x64 and x86)
echo "Building for Windows x64..."
npm run build-win-x64

echo "Building for Windows x86..."
npm run build-win-x86

# Build for Linux - Debian packages
echo "Building Linux DEB packages..."
echo "  - AMD64..."
npm run build-deb-amd64

echo "  - ARM64..."
npm run build-deb-arm64

# Build for Linux - RPM packages
echo "Building Linux RPM packages..."
echo "  - AMD64..."
npm run build-rpm-amd64

echo "  - ARM64..."
npm run build-rpm-arm64

echo "Build complete! Check the dist/ directory for all packages."

