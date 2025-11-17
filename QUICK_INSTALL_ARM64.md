# Quick Install Guide - ARM64 Debian

This is a quick walkthrough for installing Vox Browser on ARM64 Debian systems.

## Prerequisites Check

```bash
# Check you're on ARM64
uname -m
# Should output: aarch64

# Check OS
cat /etc/os-release | grep PRETTY_NAME
# Should show Debian
```

## Step 1: Install Node.js

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node --version  # Should be v20.x
npm --version
```

## Step 2: Install Build Dependencies

```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    git \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libxtst6 \
    libatspi2.0-0 \
    libappindicator3-1 \
    libsecret-1-0
```

## Step 3: Navigate to Project

```bash
cd /home/nm/Vox-Browser
```

## Step 4: Install Browser Dependencies

```bash
cd firefox-custom
npm install
```

**Wait for this to complete** (5-10 minutes)

## Step 5: Build ARM64 Debian Package

```bash
npm run build-deb-arm64
```

**Wait for build to complete** (10-20 minutes)

## Step 6: Install the Package

```bash
cd dist
sudo dpkg -i vox-browser_1.0.0_arm64.deb
sudo apt-get -f install  # Fix any dependencies
```

## Step 7: Launch Browser

```bash
vox-browser
```

Or find it in your application menu.

## Step 8: (Optional) Run Custom Installer

If you want to use the installer with AI model selection:

```bash
cd /home/nm/Vox-Browser/installer
npm install
npm start
```

## Troubleshooting

### npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

### Build fails
```bash
# Check Node.js version
node --version  # Should be v20+

# Increase memory if needed
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build-deb-arm64
```

### Package won't install
```bash
# Fix dependencies
sudo apt-get -f install

# Check for conflicts
sudo dpkg --configure -a
```

### Browser won't start
```bash
# Check logs
cat ~/.config/vox-browser/logs/*.log

# Check if binary exists
which vox-browser
ls -l /usr/bin/vox-browser
```

## File Locations After Installation

- **Config**: `~/.config/vox-browser/`
- **Cache**: `~/.cache/vox-browser/`
- **Models**: `~/.config/vox-browser/models/`
- **Logs**: `~/.config/vox-browser/logs/`

## Next Steps

1. Launch browser: `vox-browser`
2. Open vGuard (shield icon) to see security stats
3. Try AI Assistant (robot icon)
4. Configure settings in post-installation

## Full Documentation

For detailed information, see:
- `INSTALL_ARM64_DEBIAN.md` - Complete installation guide
- `WHERE_IS_EVERYTHING.md` - File locations
- `README.md` - Main documentation
- `PERFORMANCE.md` - Performance optimizations

