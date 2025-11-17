const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { PlatformUtils } = require('./platform-utils');

class TorManager {
    constructor() {
        this.torProcess = null;
        this.isActive = false;
        this.proxyPort = 9050;
        this.controlPort = 9051;
        this.torPath = null;
        this.initTorPath();
    }

    async initTorPath() {
        // Try to find Tor executable using platform utils
        this.torPath = await PlatformUtils.findExecutable('tor', PlatformUtils.getTorPaths());
    }

    findTorPath() {
        // Synchronous fallback
        const possiblePaths = PlatformUtils.getTorPaths();
        for (const torPath of possiblePaths) {
            if (fs.existsSync(torPath)) {
                return torPath;
            }
        }
        return null;
    }

    async initialize() {
        // If async init didn't complete, try sync
        if (!this.torPath) {
            this.torPath = this.findTorPath();
        }
        
        if (!this.torPath) {
            console.warn('Tor not found in system PATH. Please install Tor.');
            return false;
        }

        return true;
    }

    async start() {
        if (this.isActive) {
            return true;
        }

        if (!this.torPath) {
            throw new Error('Tor executable not found');
        }

        return new Promise((resolve, reject) => {
            const configDir = PlatformUtils.getConfigDir('vox-browser');
            const torDir = path.join(configDir, 'tor-data');
            if (!fs.existsSync(torDir)) {
                fs.mkdirSync(torDir, { recursive: true });
            }

            const args = [
                '--SocksPort', this.proxyPort.toString(),
                '--ControlPort', this.controlPort.toString(),
                '--DataDirectory', torDir,
                '--ExitNodes', '{us}',
                '--StrictNodes', '0'
            ];

            // Platform-specific spawn options
            const spawnOptions = {
                stdio: 'ignore',
                detached: false
            };

            // Windows-specific: hide window
            if (PlatformUtils.isWindows()) {
                spawnOptions.windowsHide = true;
            }

            this.torProcess = spawn(this.torPath, args, spawnOptions);

            this.torProcess.on('error', (error) => {
                reject(error);
            });

            // Wait a bit for Tor to start
            setTimeout(() => {
                this.isActive = true;
                resolve(true);
            }, 2000);
        });
    }

    async stop() {
        if (this.torProcess) {
            this.torProcess.kill();
            this.torProcess = null;
        }
        this.isActive = false;
    }

    async getProxyConfig() {
        if (!this.isActive) {
            return null;
        }

        return {
            host: '127.0.0.1',
            port: this.proxyPort,
            type: 'socks5'
        };
    }

    isActive() {
        return this.isActive;
    }

    async cleanup() {
        await this.stop();
    }
}

module.exports = { TorManager };

