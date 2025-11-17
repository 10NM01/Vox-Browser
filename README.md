# Vox Browser

Vox Browser is a private, Proton-integrated, Tor-routed browser with a local AI assistant and built-in **vGuard Security Dashboard**. This repo contains the source, packaging scripts, and downloadable installers for easy installation on multiple platforms and architectures.

## Features
- **Privacy-First**: Completely de-Googled - no Google services, tracking, or analytics
- **vGuard Security Dashboard**: Built-in ad and tracker blocker with Tor status monitoring
- **Modern Browser**: Fast, secure, and fully compatible with modern websites
- **Performance Optimized**: Automatically optimizes for slow/low-end systems
- **Local AI Assistant**: No cloud required - runs entirely on your device
- **Proton VPN Integration**: Built-in VPN support for enhanced privacy
- **Tor Routing Support**: Route traffic through Tor network
- **Privacy-Focused Search**: Default search engine is DuckDuckGo (no Google)
- **Tracking Protection**: Automatically blocks tracking domains and removes tracking parameters
- **Automatic Dependencies**: Dependencies install automatically on first launch
- **Customizable Themes**: Light and Dark modes
- **Flexible Tab Layouts**: Horizontal or Vertical tabs
- **Easy Desktop Launcher**: Quick access from your application menu
- **Low Resource Usage**: Optimized to run smoothly even on old/slow hardware

## vGuard Security Dashboard

vGuard is Vox Browser's built-in security system:
- **Ad Blocking**: Blocks ads from major ad networks
- **Tracker Blocking**: Blocks tracking scripts and analytics
- **Tor Status Monitoring**: Real-time Tor connection status
- **Local Processing**: All blocking happens locally, no cloud required
- **Enable/Disable Toggle**: Easy on/off switch
- **Statistics Dashboard**: View blocked ads, trackers, and total blocks
- **Visual Status Indicators**: See Tor status at a glance

Access vGuard by clicking the shield icon (🛡️) in the browser toolbar.

## Supported Platforms

### Windows
- Windows 10/11 x64 (.exe installer)
- Windows 10/11 x86 (.exe installer)
- Windows on ARM (ARM64) - Coming soon

### Linux
- Debian/Ubuntu (.deb)
  - AMD64 (x64)
  - ARM64 (aarch64)
- Red Hat/Fedora/CentOS (.rpm)
  - AMD64 (x64)
  - ARM64 (aarch64)
- AppImage (Universal)
  - AMD64 (x64)
  - ARM64 (aarch64)
- Arch Linux (via AUR) - Coming soon

### macOS
- macOS 10.15+ Intel (.dmg)
  - x64
- macOS 11+ Apple Silicon (.dmg)
  - ARM64 (M1/M2/M3)

## Installation

### Automatic Dependency Installation

Vox Browser automatically checks and installs required dependencies on first launch:
- **Tor**: Automatically installed if missing (Linux only)
- **Proton VPN CLI**: Optional, prompts if needed
- **Node.js dependencies**: Bundled with the application

### Windows Installation

#### For x64 (64-bit) Systems

1. **Download the installer:**
   - Download `vox-browser-1.0.0-x64.exe` from the Releases page

2. **Run the installer:**
   - Double-click the `.exe` file
   - Follow the installation wizard
   - Choose installation directory (default: `C:\Program Files\Vox Browser`)
   - Select desktop shortcut (recommended)

3. **Launch Vox Browser:**
   - From Start menu: Search for "Vox Browser"
   - From desktop: Double-click the Vox Browser shortcut
   - First launch will automatically check and install dependencies

4. **Troubleshooting:**
   - **"Windows protected your PC"**: Click "More info" → "Run anyway"
   - **Installation fails**: Run installer as Administrator
   - **Missing DLL errors**: Install Visual C++ Redistributable from Microsoft
   - **Tor not working**: Download Tor Browser from https://www.torproject.org/
   - **Antivirus blocks**: Add Vox Browser to antivirus exclusions

#### For x86 (32-bit) Systems

1. **Download the installer:**
   - Download `vox-browser-1.0.0-ia32.exe` from the Releases page

2. **Follow the same steps as x64 installation**

3. **Troubleshooting:**
   - Same as x64, but ensure you downloaded the 32-bit version
   - Some features may be limited on 32-bit systems

### Linux Installation - Debian/Ubuntu (.deb)

#### For AMD64 (x64) Systems

1. **Download the package:**
   ```bash
   wget https://github.com/10NM01/Vox-Browser/releases/download/v1.0.0/vox-browser_1.0.0_amd64.deb
   ```

2. **Install the package:**
   ```bash
   sudo dpkg -i vox-browser_1.0.0_amd64.deb
   ```

3. **Fix dependencies (if needed):**
   ```bash
   sudo apt-get update
   sudo apt-get -f install
   ```

4. **Launch Vox Browser:**
   - From application menu: Search for "Vox Browser"
   - From terminal: `vox-browser`
   - First launch will automatically install Tor if missing

5. **Troubleshooting:**
   - **"dpkg: error processing package"**: Run `sudo apt-get -f install`
   - **"Permission denied"**: Use `sudo` for installation
   - **"Package architecture mismatch"**: Ensure you downloaded AMD64 version
   - **Tor installation fails**: Manually install: `sudo apt-get install tor`
   - **Missing libraries**: Run `sudo apt-get install -f`
   - **Desktop shortcut not appearing**: Run `sudo update-desktop-database`

#### For ARM64 Systems

1. **Download the package:**
   ```bash
   wget https://github.com/10NM01/Vox-Browser/releases/download/v1.0.0/vox-browser_1.0.0_arm64.deb
   ```

2. **Install the package:**
   ```bash
   sudo dpkg -i vox-browser_1.0.0_arm64.deb
   sudo apt-get -f install
   ```

3. **Troubleshooting:**
   - Same as AMD64, but ensure you downloaded ARM64 version
   - Some ARM64 systems may need additional libraries
   - If issues persist: `sudo apt-get install libgtk-3-0 libnss3 libxss1`

### Linux Installation - Red Hat/Fedora (.rpm)

#### For x86_64 (AMD64) Systems

1. **Download the package:**
   ```bash
   wget https://github.com/10NM01/Vox-Browser/releases/download/v1.0.0/vox-browser-1.0.0.x86_64.rpm
   ```

2. **Install the package:**
   ```bash
   sudo rpm -i vox-browser-1.0.0.x86_64.rpm
   ```

3. **Or use dnf/yum:**
   ```bash
   sudo dnf install vox-browser-1.0.0.x86_64.rpm
   # or
   sudo yum install vox-browser-1.0.0.x86_64.rpm
   ```

4. **Launch Vox Browser:**
   - From application menu: Search for "Vox Browser"
   - From terminal: `vox-browser`

5. **Troubleshooting:**
   - **"Failed dependencies"**: Install missing packages: `sudo dnf install <package-name>`
   - **"Package conflicts"**: Remove conflicting packages first
   - **Tor not found**: Install Tor: `sudo dnf install tor`
   - **Permission issues**: Ensure you're using `sudo`
   - **Missing libraries**: `sudo dnf install gtk3 nss libXScrnSaver`

#### For aarch64 (ARM64) Systems

1. **Download the package:**
   ```bash
   wget https://github.com/10NM01/Vox-Browser/releases/download/v1.0.0/vox-browser-1.0.0.aarch64.rpm
   ```

2. **Install the package:**
   ```bash
   sudo rpm -i vox-browser-1.0.0.aarch64.rpm
   sudo dnf install -y tor  # Install Tor if needed
   ```

3. **Troubleshooting:**
   - Same as x86_64, but ensure ARM64 version
   - ARM64 may need additional dependencies
   - Check architecture: `uname -m` (should show `aarch64`)

### Linux Installation - AppImage

#### For x86_64 Systems

1. **Download the AppImage:**
   ```bash
   wget https://github.com/10NM01/Vox-Browser/releases/download/v1.0.0/vox-browser-1.0.0-x86_64.AppImage
   chmod +x vox-browser-1.0.0-x86_64.AppImage
   ```

2. **Run the AppImage:**
   ```bash
   ./vox-browser-1.0.0-x86_64.AppImage
   ```

3. **Make it executable (if needed):**
   ```bash
   chmod +x vox-browser-1.0.0-x86_64.AppImage
   ```

4. **Troubleshooting:**
   - **"Permission denied"**: Run `chmod +x vox-browser-1.0.0-x86_64.AppImage`
   - **"Cannot execute binary"**: Ensure you downloaded correct architecture
   - **Missing FUSE**: Install `fuse`: `sudo apt-get install fuse` or `sudo dnf install fuse`
   - **AppImage won't run**: Check if it's executable: `ls -l vox-browser-*.AppImage`

#### For aarch64 (ARM64) Systems

1. **Download the AppImage:**
   ```bash
   wget https://github.com/10NM01/Vox-Browser/releases/download/v1.0.0/vox-browser-1.0.0-aarch64.AppImage
   chmod +x vox-browser-1.0.0-aarch64.AppImage
   ```

2. **Run the AppImage:**
   ```bash
   ./vox-browser-1.0.0-aarch64.AppImage
   ```

## Building from Source

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Electron Builder
- Git

### Build All Platforms
```bash
cd build-scripts
chmod +x build-all.sh
./build-all.sh
```

### Build Specific Platform
```bash
# Debian packages
./build-deb.sh amd64
./build-deb.sh arm64

# RPM packages
./build-rpm.sh amd64
./build-rpm.sh arm64

# Windows
./build-windows.sh x64
./build-windows.sh x86
```

See `BUILD_INSTRUCTIONS.md` for detailed build instructions.

## Architecture-Specific Notes

### x64/AMD64
- **Best performance**: Full 64-bit support
- **Recommended**: Use this if your system supports it
- **Memory**: Can use more than 4GB RAM

### x86 (32-bit)
- **Legacy support**: For older systems
- **Limited**: Some features may be unavailable
- **Memory**: Limited to 4GB RAM

### ARM64/aarch64
- **ARM processors**: Raspberry Pi, Apple Silicon, ARM servers
- **Power efficient**: Lower power consumption
- **Compatibility**: Check if your system is ARM64: `uname -m`

## Troubleshooting by Issue

### Browser Won't Start

**Windows:**
- Check Windows Event Viewer for errors
- Try running as Administrator
- Reinstall Visual C++ Redistributable
- Check antivirus isn't blocking

**Linux:**
- Check logs: `journalctl -u vox-browser` or `~/.vox-browser/logs/`
- Verify dependencies: `ldd /usr/bin/vox-browser`
- Check permissions: `ls -l /usr/bin/vox-browser`
- Try running from terminal: `vox-browser` (see error messages)

### vGuard Not Blocking Ads/Trackers

- Open vGuard dashboard (shield icon)
- Ensure vGuard is enabled (toggle switch)
- Check statistics to see if anything is being blocked
- Try resetting stats
- Restart browser

### Tor Not Connecting

**All Platforms:**
- Check if Tor is installed: `tor --version` (Linux) or check Tor Browser installation (Windows)
- Check vGuard dashboard for Tor status
- Ensure Tor service is running: `sudo systemctl status tor` (Linux)
- Try manually starting Tor: `sudo systemctl start tor` (Linux)
- Check firewall isn't blocking Tor (port 9050)

**Windows:**
- Install Tor Browser from https://www.torproject.org/
- Ensure Tor is in system PATH
- Check Windows Firewall settings

**Linux:**
- Install Tor: `sudo apt-get install tor` (Debian/Ubuntu) or `sudo dnf install tor` (Fedora)
- Start Tor service: `sudo systemctl start tor`
- Enable auto-start: `sudo systemctl enable tor`

### Dependencies Not Installing Automatically

**Linux:**
- Ensure you have `sudo` access
- Check internet connection
- Try manual installation:
  ```bash
  sudo apt-get update
  sudo apt-get install tor
  ```

**Windows:**
- Dependencies must be installed manually on Windows
- Download Tor Browser separately
- Install Visual C++ Redistributable if missing

### Package Installation Fails

**Debian/Ubuntu:**
```bash
sudo apt-get update
sudo apt-get -f install
sudo dpkg --configure -a
sudo dpkg -i vox-browser_*.deb
```

**Red Hat/Fedora:**
```bash
sudo dnf check
sudo dnf install -y vox-browser-*.rpm
```

### Performance Issues

- Close other applications
- Check system resources: `htop` (Linux) or Task Manager (Windows)
- Disable unnecessary browser extensions
- Clear browser cache
- Restart browser

### Missing Libraries (Linux)

**Debian/Ubuntu:**
```bash
sudo apt-get install libgtk-3-0 libnss3 libxss1 libxtst6 libatspi2.0-0 libappindicator3-1 libsecret-1-0
```

**Red Hat/Fedora:**
```bash
sudo dnf install gtk3 nss libXScrnSaver libXtst at-spi2-atk libappindicator libsecret
```

## Configuration

After installation, configuration is stored in:
- **Windows**: `%APPDATA%/vox-browser/vox-config.json`
- **Linux**: `~/.config/vox-browser/vox-config.json`

You can manually edit this file or use the browser's settings interface.

## Performance Features

### Automatic Optimization
- **System Detection**: Automatically detects system capabilities
- **Adaptive Performance**: Adjusts settings based on available resources
- **Memory Management**: Efficient memory usage with automatic cleanup
- **Resource Throttling**: Limits resource-intensive operations on low-end systems
- **Lazy Loading**: Images and resources load only when needed
- **Cache Management**: Smart cache clearing to prevent memory bloat

### Performance Tips
- Close unused tabs to free memory
- Use lightweight AI models on slow systems (TinyLlama, Phi-2 Mini)
- Disable unnecessary features if experiencing slowdowns
- Clear cache periodically: Settings → Privacy → Clear Cache

## Privacy Features

Vox Browser is **completely de-Googled**:

- ✅ **No Google Services**: All Google domains are blocked
- ✅ **No Tracking**: Google Analytics, Tag Manager, and all tracking services blocked
- ✅ **Privacy-Focused Search**: DuckDuckGo is the default (no Google Search)
- ✅ **Tracking Parameter Removal**: Automatically removes UTM parameters, gclid, fbclid, etc.
- ✅ **Referrer Removal**: No referrer headers sent to websites
- ✅ **Alternative Search Engines**: Supports DuckDuckGo, Startpage, SearX, Qwant
- ✅ **vGuard Security**: Built-in ad and tracker blocking

## System Requirements

### Minimum Requirements (Optimized for Low-End Systems)
- **RAM**: 1GB (2GB recommended)
- **Disk Space**: 500MB for installation (more if installing AI models)
- **CPU**: Single-core processor (multi-core recommended)
- **OS**: Windows 10+, Ubuntu 18.04+, Fedora 30+, or equivalent
- **Network**: Internet connection for browsing

### Recommended Requirements
- **RAM**: 4GB or more (8GB for best performance)
- **Disk Space**: 2GB free (5GB+ if installing larger AI models)
- **CPU**: Multi-core processor
- **Network**: Internet connection for browsing

### Performance Optimizations

Vox Browser automatically detects your system capabilities and applies optimizations:

- **Very Low-End Systems** (< 2GB RAM or 1 core):
  - Disables hardware acceleration if needed
  - Enables lazy loading for images
  - Limits concurrent network requests
  - Reduces animations
  - Automatic cache management
  - Optimized memory usage

- **Low-End Systems** (< 4GB RAM or < 2 cores):
  - Enables lazy loading
  - Optimizes image loading
  - Moderate request throttling
  - Periodic cache clearing

- **Standard Systems**:
  - Full performance features enabled
  - No artificial limitations

**The browser is designed to run smoothly even on old/slow hardware!**

## Uninstallation

### Windows
1. Open Settings → Apps
2. Find "Vox Browser"
3. Click "Uninstall"
4. Or use Control Panel → Programs and Features

### Linux (Debian/Ubuntu)
```bash
sudo apt-get remove vox-browser
sudo apt-get autoremove  # Remove unused dependencies
```

### Linux (Red Hat/Fedora)
```bash
sudo dnf remove vox-browser
# or
sudo rpm -e vox-browser
```

## Contributing
Open source contributions are welcome! See LICENSE for details.

## License
MIT

## Disclaimer
This project is under active development. Report issues on GitHub.

## Questions?
Contact: variable.tech.dev@gmail.com

## Cross-Platform Compatibility

Vox Browser is **fully cross-platform** and works on:
- ✅ Windows (10, 11) - x64, x86
- ✅ Linux (all major distributions) - x64, ARM64
- ✅ macOS (10.15+) - Intel, Apple Silicon

The browser automatically:
- Detects your operating system
- Uses platform-appropriate file paths
- Finds system dependencies (Tor, etc.)
- Applies platform-specific optimizations
- Handles platform differences transparently

See `CROSS_PLATFORM.md` for detailed cross-platform information.

## Additional Resources

- **Build Instructions**: See `BUILD_INSTRUCTIONS.md`
- **Cross-Platform Guide**: See `CROSS_PLATFORM.md` - Platform compatibility details
- **Performance Guide**: See `PERFORMANCE.md` - Optimizations for slow systems
- **Privacy Features**: See `DEOGGLED_FEATURES.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`
- **Quick Start**: See `QUICKSTART.md`
- **ARM64 Debian Install**: See `INSTALL_ARM64_DEBIAN.md`
- **Quick ARM64 Install**: See `QUICK_INSTALL_ARM64.md` - Fast walkthrough
- **File Locations**: See `WHERE_IS_EVERYTHING.md` - Where to find everything
