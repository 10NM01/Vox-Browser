# Installing Vox Browser on ARM64 Debian - Complete Guide

This guide will walk you through building and installing Vox Browser on an ARM64 Debian system.

## Prerequisites

### 1. System Requirements
- **OS**: Debian 11 (Bullseye) or newer
- **Architecture**: ARM64 (aarch64)
- **RAM**: Minimum 2GB (4GB+ recommended)
- **Disk Space**: At least 2GB free (more if installing AI models)
- **Internet**: Required for downloading dependencies and AI models

### 2. Check Your System
```bash
# Check architecture
uname -m
# Should output: aarch64

# Check OS version
cat /etc/debian_version
# Should show: 11.x or 12.x

# Check available disk space
df -h
# Ensure you have at least 2GB free in /home or /tmp
```

## Quick Reference: Where Everything Is

- **Source Code**: `/home/nm/Vox-Browser/`
- **Browser Code**: `/home/nm/Vox-Browser/firefox-custom/`
- **Installer**: `/home/nm/Vox-Browser/installer/`
- **Build Scripts**: `/home/nm/Vox-Browser/build-scripts/`
- **Built Packages**: `/home/nm/Vox-Browser/firefox-custom/dist/`
- **Documentation**: `/home/nm/Vox-Browser/*.md` files

See `WHERE_IS_EVERYTHING.md` for complete file location guide.

## Step 1: Install Required Dependencies

### Update Package Lists
```bash
sudo apt-get update
```

### Install Node.js and npm
```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
# Should show: v20.x.x or higher
npm --version
# Should show: 10.x.x or higher
```

### Install Build Tools
```bash
sudo apt-get install -y \
    build-essential \
    git \
    curl \
    wget \
    dpkg-dev \
    fakeroot \
    devscripts
```

### Install System Libraries (for Electron)
```bash
sudo apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libxtst6 \
    libatspi2.0-0 \
    libappindicator3-1 \
    libsecret-1-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2
```

## Step 2: Clone or Navigate to Vox Browser

### If you have the source code:
```bash
cd /home/nm/Vox-Browser
```

### If you need to clone from repository:
```bash
cd ~
git clone <repository-url> Vox-Browser
cd Vox-Browser
```

## Step 3: Install Browser Dependencies

```bash
cd firefox-custom
npm install
```

This will install all Node.js dependencies including Electron. This may take 5-10 minutes.

## Step 4: Install Installer Dependencies

```bash
cd ../installer
npm install
```

## Step 5: Build the Debian Package

### Option A: Build using the build script
```bash
cd ../build-scripts
chmod +x build-deb.sh
./build-deb.sh arm64
```

### Option B: Build manually
```bash
cd ../firefox-custom
npm run build-deb-arm64
```

### Build Output
The built package will be in:
```
firefox-custom/dist/vox-browser_1.0.0_arm64.deb
```

## Step 6: Install the Package

### Install the .deb package
```bash
cd firefox-custom/dist
sudo dpkg -i vox-browser_1.0.0_arm64.deb
```

### Fix any missing dependencies
```bash
sudo apt-get -f install
```

## Step 7: Run the Installer (Optional)

If you want to use the custom installer:

```bash
cd ../../installer
npm start
```

The installer will:
1. Let you select an AI model (or skip)
2. Show installation summary with space requirements
3. Download and install the browser
4. Download the AI model (if selected)
5. Configure settings

## Step 8: Launch Vox Browser

### From Application Menu
- Open your application menu
- Search for "Vox Browser"
- Click to launch

### From Terminal
```bash
vox-browser
```

### First Launch
On first launch, Vox Browser will:
- Check for required dependencies (Tor, etc.)
- Automatically install Tor if missing (with sudo prompt)
- Initialize all systems

## Step 9: Verify Installation

### Check Installation
```bash
# Check if binary exists
which vox-browser

# Check version
vox-browser --version

# Check installed files
dpkg -L vox-browser
```

### Test the Browser
1. Launch Vox Browser
2. Try navigating to a website
3. Open vGuard (shield icon) - should show stats
4. Open AI Assistant (robot icon)
5. If you installed a model, try Interactive Mode (lightning icon)

## Troubleshooting

### Issue: "dpkg: error processing package"
```bash
sudo apt-get -f install
sudo dpkg --configure -a
sudo dpkg -i vox-browser_1.0.0_arm64.deb
```

### Issue: "Package architecture mismatch"
- Ensure you downloaded the ARM64 version
- Check architecture: `uname -m` (should be `aarch64`)

### Issue: "Missing libraries"
```bash
sudo apt-get install -f
sudo apt-get install libgtk-3-0 libnss3 libxss1 libxtst6
```

### Issue: "Node.js not found"
```bash
# Reinstall Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Issue: "Build fails with out of memory"
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build-deb-arm64
```

### Issue: "Tor not working"
```bash
# Install Tor manually
sudo apt-get install tor
sudo systemctl start tor
sudo systemctl enable tor
```

### Issue: "AI model download fails"
- Check internet connection
- Verify you have enough disk space
- Try a smaller model first
- Check firewall settings

## File Locations

### Installed Files
- **Binary**: `/usr/bin/vox-browser`
- **Desktop File**: `/usr/share/applications/vox-browser.desktop`
- **Config**: `~/.config/vox-browser/`
- **User Data**: `~/.config/vox-browser/`

### Source Files
- **Browser Source**: `/home/nm/Vox-Browser/firefox-custom/`
- **Installer**: `/home/nm/Vox-Browser/installer/`
- **Build Scripts**: `/home/nm/Vox-Browser/build-scripts/`
- **AI Models**: `/home/nm/Vox-Browser/llama.cpp/models/`

### Build Output
- **Debian Package**: `/home/nm/Vox-Browser/firefox-custom/dist/vox-browser_1.0.0_arm64.deb`

## Uninstallation

### Remove the Package
```bash
sudo apt-get remove vox-browser
sudo apt-get autoremove
```

### Remove User Data (Optional)
```bash
rm -rf ~/.config/vox-browser
rm -rf ~/.cache/vox-browser
```

## Next Steps

1. **Configure vGuard**: Open vGuard dashboard and enable ad/tracker blocking
2. **Set up Tor**: Enable Tor routing if needed
3. **Install AI Model**: Use the installer or download manually
4. **Customize**: Set theme, tab layout, etc. in settings

## Getting Help

- Check logs: `~/.config/vox-browser/logs/`
- System logs: `journalctl -u vox-browser`
- Contact: variable.tech.dev@gmail.com

## Quick Reference

```bash
# Build
cd /home/nm/Vox-Browser/firefox-custom
npm install
npm run build-deb-arm64

# Install
cd dist
sudo dpkg -i vox-browser_1.0.0_arm64.deb
sudo apt-get -f install

# Run
vox-browser

# Uninstall
sudo apt-get remove vox-browser
```

---

**Note**: This is a development build. For production use, ensure all dependencies are properly installed and tested.

