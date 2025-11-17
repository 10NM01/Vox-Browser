// Automatic Dependency Installer for Vox Browser
const { spawn } = require('child_process');
const { PlatformUtils } = require('./platform-utils');

class DependencyInstaller {
    constructor() {
        this.platform = PlatformUtils.getPlatform();
        this.isRoot = process.getuid && process.getuid() === 0;
    }

    async checkDependencies() {
        const missing = [];
        
        // Check for Tor
        if (!await PlatformUtils.checkCommand('tor')) {
            missing.push({ name: 'Tor', install: this.installTor.bind(this) });
        }
        
        // Check for Proton VPN CLI (optional)
        if (!await PlatformUtils.checkCommand('protonvpn-cli')) {
            // Not critical, just log
            console.log('Proton VPN CLI not found (optional)');
        }
        
        return missing;
    }

    async installTor() {
        return new Promise((resolve, reject) => {
            if (PlatformUtils.isLinux()) {
                // Try to detect package manager
                PlatformUtils.detectLinuxPackageManager().then(pm => {
                    const installCmd = PlatformUtils.getInstallCommand('tor');
                    if (installCmd) {
                        this.runCommand(installCmd, resolve, reject);
                    } else {
                        reject(new Error(`Unknown package manager: ${pm}. Please install Tor manually.`));
                    }
                });
            } else if (PlatformUtils.isWindows()) {
                // Windows - provide download link
                reject(new Error('Please install Tor Browser from https://www.torproject.org/'));
            } else if (PlatformUtils.isMacOS()) {
                // macOS - try homebrew
                const installCmd = PlatformUtils.getInstallCommand('tor');
                if (installCmd) {
                    this.runCommand(installCmd, resolve, reject);
                } else {
                    reject(new Error('Please install Tor using Homebrew: brew install tor'));
                }
            } else {
                reject(new Error('Unsupported platform'));
            }
        });
    }

    runCommand(command, resolve, reject) {
        const platform = PlatformUtils.getPlatform();
        let shell, args;
        
        if (platform === 'win32') {
            shell = 'cmd.exe';
            args = ['/c', command];
        } else {
            shell = '/bin/sh';
            args = ['-c', command];
        }

        const child = spawn(shell, args, {
            stdio: 'inherit',
            shell: false
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    }

    async installAll() {
        const missing = await this.checkDependencies();
        
        if (missing.length === 0) {
            return { success: true, message: 'All dependencies installed' };
        }

        const results = [];
        for (const dep of missing) {
            try {
                await dep.install();
                results.push({ name: dep.name, success: true });
            } catch (error) {
                results.push({ name: dep.name, success: false, error: error.message });
            }
        }

        return { success: results.every(r => r.success), results };
    }
}

module.exports = { DependencyInstaller };

