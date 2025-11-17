# Vox Browser Project Structure

## Directory Layout

```
Vox-Browser/
├── firefox-custom/          # Main browser application (Electron-based)
│   ├── main.js              # Main Electron process
│   ├── index.html           # Browser UI
│   ├── renderer.js          # Renderer process script
│   ├── styles/
│   │   └── main.css         # Browser styles (dark/light themes)
│   ├── src/
│   │   ├── tor-manager.js   # Tor routing manager
│   │   ├── proton-manager.js # Proton VPN manager
│   │   └── ai-manager.js    # Local AI assistant manager
│   ├── assets/              # Icons and resources
│   ├── package.json         # Browser dependencies and build config
│   └── .gitignore
│
├── installer/               # Custom installer application
│   ├── installer-main.js    # Installer main process
│   ├── installer-renderer.js # Installer UI logic
│   ├── installer.html       # Installer UI (black/white theme)
│   ├── installer.css        # Installer styles
│   └── package.json         # Installer dependencies
│
├── llama.cpp/              # AI engine and models directory
│   └── models/             # Place AI model files here (.gguf, .bin)
│
├── vox-deb/                # Debian package structure
│   ├── DEBIAN/
│   │   └── control         # Package metadata
│   └── usr/
│       ├── bin/            # Executables
│       └── share/
│           ├── applications/
│           │   └── vox-browser.desktop
│           └── pixmaps/    # Icons
│
├── build-scripts/          # Build scripts for all platforms
│   ├── build-all.sh        # Build all platforms
│   ├── build-deb.sh        # Build Debian packages
│   ├── build-rpm.sh        # Build RPM packages
│   └── build-windows.sh    # Build Windows installers
│
├── README.md               # Main documentation
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore rules
```

## Build Outputs

After building, packages will be in:
- `firefox-custom/dist/` - All built packages

### Windows
- `vox-browser-1.0.0-x64.exe` - 64-bit installer
- `vox-browser-1.0.0-ia32.exe` - 32-bit installer

### Linux - Debian/Ubuntu
- `vox-browser_1.0.0_amd64.deb` - AMD64 package
- `vox-browser_1.0.0_arm64.deb` - ARM64 package

### Linux - Red Hat/Fedora
- `vox-browser-1.0.0.x86_64.rpm` - AMD64 package
- `vox-browser-1.0.0.aarch64.rpm` - ARM64 package

### Linux - AppImage
- `vox-browser-1.0.0-x86_64.AppImage` - AMD64
- `vox-browser-1.0.0-aarch64.AppImage` - ARM64

## Installer Stages

### Stage 1: Pre-Installation
- AI Model Selection (optional)
- Confirmation

### Stage 2: Installation
- Progress bar
- Real-time status updates

### Stage 3: Post-Installation
- Theme selection (Light/Dark)
- Tab layout (Horizontal/Vertical)
- Tor configuration
- Proton VPN configuration

## Configuration Files

User configuration is stored in:
- **Windows**: `%APPDATA%/vox-browser/vox-config.json`
- **Linux**: `~/.config/vox-browser/vox-config.json`

Configuration includes:
- `aiModel`: Selected AI model path (or null)
- `theme`: "light" or "dark"
- `tabLayout`: "horizontal" or "vertical"
- `torEnabled`: boolean
- `protonEnabled`: boolean

