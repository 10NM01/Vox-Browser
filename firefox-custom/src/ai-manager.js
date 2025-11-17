const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AIManager {
    constructor() {
        this.llamaProcess = null;
        this.isReady = false;
        this.modelPath = null;
        this.availableModels = [];
    }

    async initialize() {
        // Check for llama.cpp installation
        const llamaPath = this.findLlamaPath();
        if (!llamaPath) {
            console.warn('llama.cpp not found. AI features will be limited.');
            return false;
        }

        // Look for models in platform-appropriate location
        const { PlatformUtils } = require('./platform-utils');
        const configDir = PlatformUtils.getConfigDir('vox-browser');
        const modelsDir = path.join(configDir, 'models');
        
        // Also check legacy location
        const legacyModelsDir = path.join(__dirname, '..', '..', 'llama.cpp', 'models');
        
        if (fs.existsSync(modelsDir)) {
            this.availableModels = fs.readdirSync(modelsDir)
                .filter(file => file.endsWith('.gguf') || file.endsWith('.bin'));
        } else if (fs.existsSync(legacyModelsDir)) {
            // Fallback to legacy location
            this.availableModels = fs.readdirSync(legacyModelsDir)
                .filter(file => file.endsWith('.gguf') || file.endsWith('.bin'));
        }

        this.isReady = true;
        return true;
    }

    findLlamaPath() {
        const { PlatformUtils } = require('./platform-utils');
        const possiblePaths = [
            path.join(__dirname, '..', '..', 'llama.cpp', 'build', 'bin', 'llama-cli'),
            path.join(__dirname, '..', '..', 'llama.cpp', 'build', 'bin', 'main'),
        ];

        // Add platform-specific paths
        if (PlatformUtils.isWindows()) {
            possiblePaths.push(
                'C:\\Program Files\\llama.cpp\\llama-cli.exe',
                path.join(PlatformUtils.getHomeDir(), 'AppData', 'Local', 'llama.cpp', 'llama-cli.exe')
            );
        } else if (PlatformUtils.isMacOS()) {
            possiblePaths.push(
                '/usr/local/bin/llama-cli',
                '/opt/homebrew/bin/llama-cli',
                path.join(PlatformUtils.getHomeDir(), '.local', 'bin', 'llama-cli')
            );
        } else {
            // Linux
            possiblePaths.push(
                '/usr/local/bin/llama-cli',
                '/usr/bin/llama-cli',
                path.join(PlatformUtils.getHomeDir(), '.local', 'bin', 'llama-cli')
            );
        }

        for (const llamaPath of possiblePaths) {
            if (fs.existsSync(llamaPath)) {
                return llamaPath;
            }
        }

        return null;
    }

    async loadModel(modelPath) {
        if (!fs.existsSync(modelPath)) {
            throw new Error('Model file not found');
        }

        this.modelPath = modelPath;
        return true;
    }

    async query(prompt) {
        if (!this.isReady) {
            return 'AI assistant is not ready. Please configure a model in settings.';
        }

        if (!this.modelPath) {
            return 'No AI model loaded. Please select a model in the installer or settings.';
        }

        // For now, return a placeholder response
        // In a real implementation, this would spawn llama.cpp process
        return `AI Response to: "${prompt}"\n\n[Note: This requires llama.cpp to be properly configured with a model file. Please ensure you've selected a model during installation.]`;
    }

    getAvailableModels() {
        return this.availableModels;
    }

    async cleanup() {
        if (this.llamaProcess) {
            this.llamaProcess.kill();
            this.llamaProcess = null;
        }
    }
}

module.exports = { AIManager };

