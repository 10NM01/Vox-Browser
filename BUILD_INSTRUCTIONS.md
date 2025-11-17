# Build Instructions for Vox Browser

## Prerequisites Installation

### Linux (Debian/Ubuntu)
```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v20.x or higher
npm --version
```

### Linux (Red Hat/Fedora)
```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Or use NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

### Windows
1. Download Node.js from https://nodejs.org/
2. Install the LTS version (v20.x or higher)
3. Verify in Command Prompt:
   ```cmd
   node --version
   npm --version
   ```

## Building the Browser

### Step 1: Install Dependencies

```bash
cd firefox-custom
npm install
```

### Step 2: Build for Your Platform

#### Build All Platforms
```bash
cd ../build-scripts
chmod +x build-all.sh
./build-all.sh
```

#### Build Specific Platform

**Linux DEB (AMD64):**
```bash
cd firefox-custom
npm run build-deb-amd64
```

**Linux DEB (ARM64):**
```bash
cd firefox-custom
npm run build-deb-arm64
```

**Linux RPM (AMD64):**
```bash
cd firefox-custom
npm run build-rpm-amd64
```

**Linux RPM (ARM64):**
```bash
cd firefox-custom
npm run build-rpm-arm64
```

**Windows (x64):**
```bash
cd firefox-custom
npm run build-win-x64
```

**Windows (x86):**
```bash
cd firefox-custom
npm run build-win-x86
```

### Step 3: Find Built Packages

All built packages will be in:
```
firefox-custom/dist/
```

## Development Mode

To run the browser in development mode:

```bash
cd firefox-custom
npm start
```

## Building the Installer

```bash
cd installer
npm install
npm start
```

## Troubleshooting

### npm: command not found
- Install Node.js and npm (see Prerequisites above)
- Make sure Node.js is in your PATH

### Build fails with "electron not found"
```bash
cd firefox-custom
rm -rf node_modules package-lock.json
npm install
```

### Permission denied on build scripts
```bash
chmod +x build-scripts/*.sh
```

### Out of memory during build
- Increase Node.js memory: `export NODE_OPTIONS="--max-old-space-size=4096"`
- Or build one platform at a time

## Build Requirements

- **RAM**: At least 4GB (8GB recommended)
- **Disk Space**: At least 5GB free
- **Time**: 10-30 minutes depending on platform

## Cross-Platform Building

To build for Windows from Linux, you need:
- Wine (for testing)
- Or use a Windows VM/CI service

To build for Linux from Windows:
- Use WSL2 (Windows Subsystem for Linux)
- Or use a Linux VM

## CI/CD Integration

For automated builds, you can use:
- GitHub Actions
- GitLab CI
- Jenkins
- Travis CI

Example GitHub Actions workflow is available in `.github/workflows/build.yml` (if created).

