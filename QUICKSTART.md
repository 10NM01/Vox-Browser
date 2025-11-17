# Quick Start Guide

## Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **System Dependencies** (for full functionality):
   - Tor (for Tor routing)
   - Proton VPN CLI (for Proton integration)
   - llama.cpp (for local AI, optional)

## Development Setup

### 1. Install Browser Dependencies
```bash
cd firefox-custom
npm install
```

### 2. Install Installer Dependencies
```bash
cd ../installer
npm install
```

### 3. Run Browser in Development
```bash
cd firefox-custom
npm start
```

### 4. Run Installer in Development
```bash
cd installer
npm start
```

## Building Packages

### Build All Platforms
```bash
cd build-scripts
./build-all.sh
```

### Build Specific Platform

#### Debian Package (AMD64)
```bash
./build-deb.sh amd64
```

#### Debian Package (ARM64)
```bash
./build-deb.sh arm64
```

#### RPM Package (AMD64)
```bash
./build-rpm.sh amd64
```

#### RPM Package (ARM64)
```bash
./build-rpm.sh arm64
```

#### Windows (x64)
```bash
./build-windows.sh x64
```

#### Windows (x86)
```bash
./build-windows.sh x86
```

### Manual Build Commands

From `firefox-custom/` directory:

```bash
# All Linux packages
npm run build-linux

# Specific formats
npm run build-deb-amd64
npm run build-deb-arm64
npm run build-rpm-amd64
npm run build-rpm-arm64

# Windows
npm run build-win-x64
npm run build-win-x86
```

## Adding AI Models

1. Place model files in `llama.cpp/models/`
2. Supported formats: `.gguf`, `.bin`
3. Models will appear in installer's AI selection dropdown

## Testing the Installer

1. Run the installer:
   ```bash
   cd installer
   npm start
   ```

2. Go through the three stages:
   - Select AI model (or None)
   - Watch installation progress
   - Configure theme, tabs, Tor, and Proton

3. Configuration is saved to user data directory

## Troubleshooting

### Build Errors
- Ensure Node.js v18+ is installed
- Run `npm install` in both `firefox-custom/` and `installer/` directories
- Check that electron-builder is properly installed

### Tor Not Working
- Install Tor: `sudo apt-get install tor` (Debian/Ubuntu)
- Ensure Tor is running: `sudo systemctl status tor`

### Proton VPN Not Working
- Install Proton VPN CLI
- Ensure you're logged in: `protonvpn-cli login`

### AI Assistant Not Working
- Place model files in `llama.cpp/models/`
- Ensure llama.cpp is compiled and in PATH
- Select a model during installation

## Next Steps

1. Customize the browser UI in `firefox-custom/styles/main.css`
2. Add features in `firefox-custom/src/`
3. Modify installer stages in `installer/installer.html`
4. Update build configurations in `firefox-custom/package.json`

