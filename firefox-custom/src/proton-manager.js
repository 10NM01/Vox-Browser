const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { PlatformUtils } = require('./platform-utils');

class ProtonManager {
    constructor() {
        this.protonProcess = null;
        this.isActive = false;
        this.protonPath = null;
        this.initProtonPath();
    }

    async initProtonPath() {
        // Try to find Proton VPN CLI using platform utils
        this.protonPath = await PlatformUtils.findExecutable('protonvpn-cli', PlatformUtils.getProtonPaths());
    }

    findProtonPath() {
        // Synchronous fallback
        const possiblePaths = PlatformUtils.getProtonPaths();
        for (const protonPath of possiblePaths) {
            if (fs.existsSync(protonPath)) {
                return protonPath;
            }
        }
        return null;
    }

    async initialize() {
        // If async init didn't complete, try sync
        if (!this.protonPath) {
            this.protonPath = this.findProtonPath();
        }
        
        if (!this.protonPath) {
            console.warn('Proton VPN not found. Please install Proton VPN.');
            return false;
        }

        return true;
    }

    async connect() {
        if (this.isActive) {
            return true;
        }

        if (!this.protonPath) {
            throw new Error('Proton VPN executable not found');
        }

        return new Promise((resolve, reject) => {
            // This would require actual Proton VPN CLI integration
            // For now, we'll simulate the connection
            setTimeout(() => {
                this.isActive = true;
                resolve(true);
            }, 1000);
        });
    }

    async disconnect() {
        this.isActive = false;
    }

    isActive() {
        return this.isActive;
    }

    async cleanup() {
        await this.disconnect();
    }
}

module.exports = { ProtonManager };

