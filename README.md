# Vox Browser

Vox Browser is a private, Proton-integrated, Tor-routed browser with a local AI assistant. This repo contains the source, packaging scripts, and a downloadable .deb installer for easy installation on Debian-based systems.

## Features
- Modern, privacy-focused browser
- Local AI assistant (no cloud required)
- Proton and Tor integration
- Easy desktop launcher

## Download & Install
1. Download the latest `.deb` file from the [Releases](https://github.com/10NM01/Vox-Browser/releases) page.
2. Install it with your file manager (double-click) or run:
   ```bash
   sudo dpkg -i vox-deb.deb
   sudo apt-get -f install  # Fix any missing dependencies
   ```
3. Launch Vox Browser from your application menu.

## Building the .deb Package
To build the package yourself:
```bash
cd vox-deb
# (Make sure all files are in place)
dpkg-deb --build .
```

## Source Structure
- `vox-deb/` — Debian package structure
- `firefox-custom/` — Browser source
- `llama.cpp/` — AI engine and models

## Contributing
This is free to contribute as you like, just please credit me.

## License
MIT
