// Platform Utilities - Cross-platform compatibility helpers
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class PlatformUtils {
    static getPlatform() {
        return os.platform();
    }

    static isWindows() {
        return process.platform === 'win32';
    }

    static isLinux() {
        return process.platform === 'linux';
    }

    static isMacOS() {
        return process.platform === 'darwin';
    }

    static getHomeDir() {
        return os.homedir();
    }

    static getAppDataDir() {
        const platform = this.getPlatform();
        if (platform === 'win32') {
            return process.env.APPDATA || path.join(this.getHomeDir(), 'AppData', 'Roaming');
        } else if (platform === 'darwin') {
            return path.join(this.getHomeDir(), 'Library', 'Application Support');
        } else {
            // Linux and others
            return process.env.XDG_CONFIG_HOME || path.join(this.getHomeDir(), '.config');
        }
    }

    static getConfigDir(appName = 'vox-browser') {
        return path.join(this.getAppDataDir(), appName);
    }

    static getCacheDir(appName = 'vox-browser') {
        const platform = this.getPlatform();
        if (platform === 'win32') {
            return process.env.LOCALAPPDATA || path.join(this.getHomeDir(), 'AppData', 'Local', appName);
        } else if (platform === 'darwin') {
            return path.join(this.getHomeDir(), 'Library', 'Caches', appName);
        } else {
            return process.env.XDG_CACHE_HOME || path.join(this.getHomeDir(), '.cache', appName);
        }
    }

    static async findExecutable(command, possiblePaths) {
        // First try which/where command
        try {
            const cmd = this.isWindows() ? `where ${command}` : `which ${command}`;
            const { stdout } = await execAsync(cmd);
            const foundPath = stdout.trim().split('\n')[0];
            if (foundPath) {
                return foundPath;
            }
        } catch (e) {
            // Command not in PATH, continue to check possible paths
        }

        // Check possible paths
        for (const possiblePath of possiblePaths) {
            try {
                const fs = require('fs');
                if (fs.existsSync(possiblePath)) {
                    return possiblePath;
                }
            } catch (e) {
                // Continue
            }
        }

        return null;
    }

    static getTorPaths() {
        if (this.isWindows()) {
            return [
                'C:\\Program Files\\Tor\\tor.exe',
                'C:\\Program Files (x86)\\Tor\\tor.exe',
                path.join(this.getHomeDir(), 'AppData', 'Local', 'Tor Browser', 'Browser', 'TorBrowser', 'Tor', 'tor.exe')
            ];
        } else if (this.isMacOS()) {
            return [
                '/usr/local/bin/tor',
                '/opt/homebrew/bin/tor',
                '/usr/bin/tor',
                '/Applications/TorBrowser.app/Contents/MacOS/Tor/tor'
            ];
        } else {
            // Linux
            return [
                '/usr/bin/tor',
                '/usr/local/bin/tor',
                '/snap/bin/tor'
            ];
        }
    }

    static getProtonPaths() {
        if (this.isWindows()) {
            return [
                'C:\\Program Files\\ProtonVPN\\protonvpn-cli.exe',
                path.join(this.getHomeDir(), 'AppData', 'Local', 'Programs', 'ProtonVPN', 'protonvpn-cli.exe')
            ];
        } else if (this.isMacOS()) {
            return [
                '/usr/local/bin/protonvpn-cli',
                '/opt/homebrew/bin/protonvpn-cli',
                '/Applications/ProtonVPN.app/Contents/MacOS/protonvpn-cli'
            ];
        } else {
            // Linux
            return [
                '/usr/bin/protonvpn-cli',
                '/usr/local/bin/protonvpn-cli',
                '/snap/bin/protonvpn-cli'
            ];
        }
    }

    static getPackageManager() {
        if (this.isWindows()) {
            return 'chocolatey'; // or winget, but chocolatey is more common
        } else if (this.isMacOS()) {
            return 'homebrew';
        } else {
            // Linux - detect
            return this.detectLinuxPackageManager();
        }
    }

    static async detectLinuxPackageManager() {
        const managers = [
            { name: 'apt', command: 'apt-get' },
            { name: 'yum', command: 'yum' },
            { name: 'dnf', command: 'dnf' },
            { name: 'pacman', command: 'pacman' },
            { name: 'zypper', command: 'zypper' },
            { name: 'apk', command: 'apk' }
        ];

        for (const manager of managers) {
            try {
                await execAsync(`which ${manager.command}`);
                return manager.name;
            } catch (e) {
                // Continue
            }
        }

        return 'unknown';
    }

    static getInstallCommand(packageName) {
        const pm = this.getPackageManager();
        
        if (this.isWindows()) {
            if (pm === 'chocolatey') {
                return `choco install ${packageName} -y`;
            } else {
                return null; // Manual installation required
            }
        } else if (this.isMacOS()) {
            if (pm === 'homebrew') {
                return `brew install ${packageName}`;
            } else {
                return null;
            }
        } else {
            // Linux
            switch (pm) {
                case 'apt':
                    return `sudo apt-get install -y ${packageName}`;
                case 'yum':
                    return `sudo yum install -y ${packageName}`;
                case 'dnf':
                    return `sudo dnf install -y ${packageName}`;
                case 'pacman':
                    return `sudo pacman -S --noconfirm ${packageName}`;
                case 'zypper':
                    return `sudo zypper install -y ${packageName}`;
                case 'apk':
                    return `sudo apk add ${packageName}`;
                default:
                    return null;
            }
        }
    }

    static normalizePath(filePath) {
        if (this.isWindows()) {
            return filePath.replace(/\//g, '\\');
        }
        return filePath;
    }

    static getPathSeparator() {
        return this.isWindows() ? '\\' : '/';
    }

    static async checkCommand(command) {
        try {
            const cmd = this.isWindows() ? `where ${command}` : `which ${command}`;
            await execAsync(cmd);
            return true;
        } catch (e) {
            return false;
        }
    }

    static getSystemInfo() {
        return {
            platform: this.getPlatform(),
            arch: os.arch(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            cpuCount: os.cpus().length,
            cpuModel: os.cpus()[0]?.model || 'Unknown',
            hostname: os.hostname(),
            homeDir: this.getHomeDir(),
            tempDir: os.tmpdir()
        };
    }
}

module.exports = { PlatformUtils };

