# Where is Everything? - File Locations Guide

This guide shows you where all Vox Browser files are located on your system.

## Project Structure (Source Code)

If you cloned or have the source code:

```
/home/nm/Vox-Browser/          # Main project directory
├── firefox-custom/            # Browser source code
│   ├── main.js                # Main Electron process
│   ├── index.html             # Browser UI
│   ├── renderer.js             # Renderer process
│   ├── package.json            # Browser dependencies
│   ├── src/                    # Source modules
│   │   ├── tor-manager.js      # Tor integration
│   │   ├── proton-manager.js   # Proton VPN
│   │   ├── ai-manager.js       # AI assistant
│   │   ├── vguard.js           # Security dashboard
│   │   ├── privacy-manager.js  # Privacy features
│   │   ├── interactive-agent.js # Interactive Mode
│   │   ├── performance-optimizer.js # Performance
│   │   ├── model-downloader.js # AI model downloader
│   │   ├── dependency-installer.js # Auto-installer
│   │   └── platform-utils.js   # Cross-platform utilities
│   ├── styles/                 # CSS files
│   │   └── main.css            # Main stylesheet
│   └── assets/                 # Icons and resources
│
├── installer/                  # Custom installer
│   ├── installer-main.js       # Installer main process
│   ├── installer-renderer.js   # Installer UI logic
│   ├── installer.html          # Installer UI
│   ├── installer.css           # Installer styles
│   └── package.json            # Installer dependencies
│
├── build-scripts/              # Build automation
│   ├── build-all.sh            # Build all platforms
│   ├── build-deb.sh            # Build Debian packages
│   ├── build-rpm.sh            # Build RPM packages
│   └── build-windows.sh        # Build Windows installers
│
├── vox-deb/                    # Debian package structure
│   ├── DEBIAN/                 # Package metadata
│   └── usr/                     # Installation files
│
├── llama.cpp/                  # AI models directory
│   └── models/                  # AI model files go here
│
└── Documentation/
    ├── README.md               # Main documentation
    ├── BUILD_INSTRUCTIONS.md   # How to build
    ├── CROSS_PLATFORM.md       # Platform compatibility
    ├── PERFORMANCE.md          # Performance guide
    ├── INSTALL_ARM64_DEBIAN.md # ARM64 installation
    └── WHERE_IS_EVERYTHING.md  # This file
```

## Built Packages Location

After building, packages are in:

```
firefox-custom/dist/
├── vox-browser_1.0.0_amd64.deb      # Linux DEB (AMD64)
├── vox-browser_1.0.0_arm64.deb      # Linux DEB (ARM64)
├── vox-browser-1.0.0.x86_64.rpm     # Linux RPM (AMD64)
├── vox-browser-1.0.0.aarch64.rpm    # Linux RPM (ARM64)
├── vox-browser-1.0.0-x64.exe        # Windows (x64)
├── vox-browser-1.0.0-ia32.exe      # Windows (x86)
├── vox-browser-1.0.0-x64.dmg        # macOS (Intel)
├── vox-browser-1.0.0-arm64.dmg     # macOS (Apple Silicon)
└── vox-browser-1.0.0-*.AppImage     # Linux AppImage
```

## Installed Files Location

### Windows

**Program Files:**
- `C:\Program Files\Vox Browser\` - Main installation
- `C:\Program Files (x86)\Vox Browser\` - 32-bit installation

**User Data:**
- Config: `%APPDATA%\vox-browser\` (usually `C:\Users\YourName\AppData\Roaming\vox-browser\`)
- Cache: `%LOCALAPPDATA%\vox-browser\` (usually `C:\Users\YourName\AppData\Local\vox-browser\`)
- Logs: `%APPDATA%\vox-browser\logs\`
- Models: `%APPDATA%\vox-browser\models\`

**Shortcuts:**
- Desktop: `C:\Users\YourName\Desktop\Vox Browser.lnk`
- Start Menu: `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Vox Browser\`

### Linux

**System Files:**
- Binary: `/usr/bin/vox-browser`
- Desktop Entry: `/usr/share/applications/vox-browser.desktop`
- Icons: `/usr/share/pixmaps/vox-browser.png`

**User Data:**
- Config: `~/.config/vox-browser/`
- Cache: `~/.cache/vox-browser/`
- Logs: `~/.config/vox-browser/logs/`
- Models: `~/.config/vox-browser/models/`

**AppImage (if used):**
- Location: Wherever you placed the AppImage file
- User Data: Same as above (`~/.config/vox-browser/`)

### macOS

**Application:**
- `/Applications/Vox Browser.app` - Main application

**User Data:**
- Config: `~/Library/Application Support/vox-browser/`
- Cache: `~/Library/Caches/vox-browser/`
- Logs: `~/Library/Logs/vox-browser/`
- Models: `~/Library/Application Support/vox-browser/models/`

## Configuration Files

### Main Config
- **Windows**: `%APPDATA%\vox-browser\vox-config.json`
- **Linux**: `~/.config/vox-browser/vox-config.json`
- **macOS**: `~/Library/Application Support/vox-browser/vox-config.json`

### Config Contents
```json
{
  "aiModel": "tinyllama-1.1b",
  "theme": "dark",
  "tabLayout": "horizontal",
  "torEnabled": false,
  "protonEnabled": false
}
```

## AI Models Location

Models are downloaded to:
- **Windows**: `%APPDATA%\vox-browser\models\`
- **Linux**: `~/.config/vox-browser/models/`
- **macOS**: `~/Library/Application Support/vox-browser/models/`

Model files have extensions: `.gguf` or `.bin`

## Logs Location

Logs are stored in:
- **Windows**: `%APPDATA%\vox-browser\logs\`
- **Linux**: `~/.config/vox-browser/logs/`
- **macOS**: `~/Library/Logs/vox-browser/`

## Temporary Files

### Tor Data
- **Windows**: `%APPDATA%\vox-browser\tor-data\`
- **Linux**: `~/.config/vox-browser/tor-data/`
- **macOS**: `~/Library/Application Support/vox-browser/tor-data/`

### Cache
- **Windows**: `%LOCALAPPDATA%\vox-browser\cache\`
- **Linux**: `~/.cache/vox-browser/`
- **macOS**: `~/Library/Caches/vox-browser/`

## Finding Files on Your System

### Windows
```cmd
REM Find config
dir %APPDATA%\vox-browser

REM Find installed location
dir "C:\Program Files\Vox Browser"
```

### Linux
```bash
# Find config
ls -la ~/.config/vox-browser/

# Find installed files
dpkg -L vox-browser  # Debian/Ubuntu
rpm -ql vox-browser   # Red Hat/Fedora

# Find binary
which vox-browser
```

### macOS
```bash
# Find config
ls -la ~/Library/Application\ Support/vox-browser/

# Find app
ls -la /Applications/Vox\ Browser.app/
```

## Quick Access Commands

### Open Config Directory

**Windows:**
```cmd
explorer %APPDATA%\vox-browser
```

**Linux:**
```bash
xdg-open ~/.config/vox-browser/
# or
nautilus ~/.config/vox-browser/  # GNOME
dolphin ~/.config/vox-browser/   # KDE
```

**macOS:**
```bash
open ~/Library/Application\ Support/vox-browser/
```

### View Logs

**Windows:**
```cmd
type %APPDATA%\vox-browser\logs\*.log
```

**Linux/macOS:**
```bash
cat ~/.config/vox-browser/logs/*.log
# or
tail -f ~/.config/vox-browser/logs/*.log
```

## Summary

| Item | Windows | Linux | macOS |
|------|---------|-------|-------|
| **Config** | `%APPDATA%\vox-browser\` | `~/.config/vox-browser/` | `~/Library/Application Support/vox-browser/` |
| **Cache** | `%LOCALAPPDATA%\vox-browser\` | `~/.cache/vox-browser/` | `~/Library/Caches/vox-browser/` |
| **Models** | `%APPDATA%\vox-browser\models\` | `~/.config/vox-browser/models/` | `~/Library/Application Support/vox-browser/models/` |
| **Logs** | `%APPDATA%\vox-browser\logs\` | `~/.config/vox-browser/logs/` | `~/Library/Logs/vox-browser/` |
| **Binary** | `C:\Program Files\Vox Browser\` | `/usr/bin/vox-browser` | `/Applications/Vox Browser.app/` |

All paths are automatically handled by the browser - you don't need to manually configure them!

