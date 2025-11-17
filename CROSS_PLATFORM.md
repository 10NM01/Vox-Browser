# Cross-Platform Compatibility Guide

Vox Browser is designed to work seamlessly across all major operating systems and platforms.

## Supported Platforms

### Operating Systems
- ✅ **Windows** (10, 11)
  - x64 (64-bit)
  - x86 (32-bit)
- ✅ **Linux**
  - Debian/Ubuntu (.deb)
  - Red Hat/Fedora/CentOS (.rpm)
  - AppImage (universal)
  - Arch Linux (via AUR)
- ✅ **macOS** (10.15+)
  - Intel (x64)
  - Apple Silicon (ARM64/M1/M2/M3)

### Architectures
- ✅ **x64/AMD64** - Standard 64-bit
- ✅ **x86/ia32** - 32-bit (Windows/Linux)
- ✅ **ARM64/aarch64** - ARM 64-bit (Linux, macOS, Windows on ARM)

## Platform-Specific Features

### Windows
- **Installation**: `.exe` installer (NSIS)
- **Config Location**: `%APPDATA%\vox-browser\`
- **Cache Location**: `%LOCALAPPDATA%\vox-browser\`
- **Tor Path**: `C:\Program Files\Tor\tor.exe`
- **Start Menu**: Automatic shortcut creation
- **Desktop Shortcut**: Optional during installation

### Linux
- **Installation**: `.deb`, `.rpm`, or AppImage
- **Config Location**: `~/.config/vox-browser/`
- **Cache Location**: `~/.cache/vox-browser/`
- **Tor Path**: `/usr/bin/tor` or `/usr/local/bin/tor`
- **Desktop Entry**: `/usr/share/applications/vox-browser.desktop`
- **Package Managers**: apt, yum, dnf, pacman, zypper, apk

### macOS
- **Installation**: `.dmg` or `.zip`
- **Config Location**: `~/Library/Application Support/vox-browser/`
- **Cache Location**: `~/Library/Caches/vox-browser/`
- **Tor Path**: `/usr/local/bin/tor` or Homebrew path
- **Applications Folder**: Automatic installation
- **Code Signing**: Required for distribution

## Cross-Platform Compatibility Features

### Automatic Path Detection
- **Tor**: Automatically finds Tor on all platforms
- **Proton VPN**: Detects Proton VPN CLI across platforms
- **Config Files**: Uses platform-appropriate directories
- **Executables**: Finds system binaries automatically

### Platform Utilities
The `PlatformUtils` class provides:
- Platform detection (Windows/Linux/macOS)
- Path normalization
- Executable finding
- Package manager detection
- System information

### File Path Handling
All file paths use Node.js `path.join()` for cross-platform compatibility:
```javascript
// Works on all platforms
const configPath = path.join(homeDir, '.config', 'vox-browser');
```

### Command Execution
Commands are executed using platform-appropriate methods:
- **Windows**: `cmd.exe /c`
- **Linux/macOS**: `/bin/sh -c`

## Building for All Platforms

### From Linux
```bash
# Build all platforms
npm run build-all

# Or build specific platforms
npm run build-win-x64    # Windows x64
npm run build-linux       # Linux packages
npm run build-mac-arm64   # macOS Apple Silicon
```

### From Windows
```bash
# Build Windows packages
npm run build-win-x64
npm run build-win-x86

# Note: Linux/macOS builds require cross-compilation tools
```

### From macOS
```bash
# Build macOS packages
npm run build-mac-arm64   # Apple Silicon
npm run build-mac-x64     # Intel

# Build Linux (requires Docker or VM)
```

## Platform-Specific Installation

### Windows Installation
1. Download `.exe` installer
2. Run installer (may require Administrator)
3. Follow installation wizard
4. Launch from Start Menu

### Linux Installation

#### Debian/Ubuntu
```bash
sudo dpkg -i vox-browser_1.0.0_amd64.deb
sudo apt-get -f install
```

#### Red Hat/Fedora
```bash
sudo rpm -i vox-browser-1.0.0.x86_64.rpm
# or
sudo dnf install vox-browser-1.0.0.x86_64.rpm
```

#### AppImage
```bash
chmod +x vox-browser-1.0.0-x86_64.AppImage
./vox-browser-1.0.0-x86_64.AppImage
```

### macOS Installation
1. Download `.dmg` file
2. Open DMG
3. Drag Vox Browser to Applications
4. Launch from Applications folder
5. (First launch) Allow in System Preferences → Security

## Platform-Specific Dependencies

### Windows
- **Tor**: Download from torproject.org
- **Visual C++ Redistributable**: Required
- **Node.js**: For building only

### Linux
- **Tor**: `sudo apt-get install tor` (or equivalent)
- **System Libraries**: Automatically installed with package
- **Node.js**: For building only

### macOS
- **Tor**: `brew install tor` (or download)
- **Xcode Command Line Tools**: For building
- **Node.js**: For building only

## Testing Cross-Platform Compatibility

### Automated Testing
```bash
# Test on current platform
npm test

# Test specific platform features
npm run test:windows
npm run test:linux
npm run test:macos
```

### Manual Testing Checklist

#### Windows
- [ ] Installer runs correctly
- [ ] Browser launches
- [ ] Tor detection works
- [ ] Config files save correctly
- [ ] Desktop shortcut created
- [ ] Uninstaller works

#### Linux
- [ ] Package installs correctly
- [ ] Desktop entry created
- [ ] Browser launches from menu
- [ ] Tor detection works
- [ ] Config files in correct location
- [ ] Package uninstalls cleanly

#### macOS
- [ ] DMG opens correctly
- [ ] App installs to Applications
- [ ] Browser launches
- [ ] Gatekeeper allows execution
- [ ] Tor detection works
- [ ] Config files in correct location

## Known Platform Limitations

### Windows
- Tor must be installed separately (not auto-installed)
- Some features may require Administrator privileges
- Windows Defender may flag installer (false positive)

### Linux
- Some distributions may need additional libraries
- AppImage requires FUSE (usually pre-installed)
- SELinux may require additional configuration

### macOS
- Code signing required for distribution
- Gatekeeper may block unsigned builds
- Some features require user permission

## Troubleshooting by Platform

### Windows Issues

**"Windows protected your PC"**
- Click "More info" → "Run anyway"
- Or add to exclusions in Windows Defender

**Missing DLL errors**
- Install Visual C++ Redistributable
- Download from Microsoft

**Tor not found**
- Install Tor Browser separately
- Ensure it's in PATH or standard location

### Linux Issues

**Package conflicts**
```bash
sudo apt-get -f install
sudo dpkg --configure -a
```

**Missing libraries**
```bash
sudo apt-get install libgtk-3-0 libnss3 libxss1
```

**AppImage won't run**
```bash
chmod +x vox-browser-*.AppImage
# If FUSE missing:
sudo apt-get install fuse
```

### macOS Issues

**"App is damaged"**
- Remove quarantine: `xattr -cr /Applications/Vox\ Browser.app`
- Or allow in System Preferences → Security

**Tor not found**
```bash
brew install tor
# Or download from torproject.org
```

**Code signing errors**
- Only affects distribution builds
- Development builds work without signing

## Platform-Specific Optimizations

### Windows
- Uses Windows-specific process priorities
- Optimized for Windows file system
- Supports Windows-specific features

### Linux
- Uses Linux process management (renice)
- Optimized for ext4/XFS file systems
- Supports Linux-specific features

### macOS
- Uses macOS process management
- Optimized for APFS file system
- Supports macOS-specific features (notifications, etc.)

## File Locations Summary

| Platform | Config | Cache | Logs |
|----------|--------|-------|------|
| Windows | `%APPDATA%\vox-browser\` | `%LOCALAPPDATA%\vox-browser\` | `%APPDATA%\vox-browser\logs\` |
| Linux | `~/.config/vox-browser/` | `~/.cache/vox-browser/` | `~/.config/vox-browser/logs/` |
| macOS | `~/Library/Application Support/vox-browser/` | `~/Library/Caches/vox-browser/` | `~/Library/Logs/vox-browser/` |

## Conclusion

Vox Browser is fully cross-platform compatible and automatically adapts to your operating system. All platform-specific code is handled transparently, ensuring a consistent experience across Windows, Linux, and macOS.

For platform-specific installation instructions, see:
- **Windows**: README.md (Windows Installation section)
- **Linux**: README.md (Linux Installation section) or INSTALL_ARM64_DEBIAN.md
- **macOS**: README.md (macOS Installation section)

