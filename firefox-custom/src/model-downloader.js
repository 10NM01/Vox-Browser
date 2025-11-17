// AI Model Downloader - Downloads models from trusted sources
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Trusted model sources and their information
const MODEL_SOURCES = {
    'tinyllama-1.1b': {
        name: 'TinyLlama 1.1B',
        size: '700 MB',
        sizeBytes: 734003200,
        url: 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
        source: 'Hugging Face (TheBloke)',
        requirements: {
            ram: '2 GB',
            vram: '1 GB',
            disk: '1 GB',
            cpu: 'Any',
            speed: 'Very Fast'
        },
        description: 'Ultra-lightweight model perfect for old/slow hardware'
    },
    'phi-2-mini': {
        name: 'Phi-2 Mini',
        size: '1.5 GB',
        sizeBytes: 1610612736,
        url: 'https://huggingface.co/microsoft/phi-2/resolve/main/phi-2.gguf',
        source: 'Hugging Face (Microsoft)',
        requirements: {
            ram: '4 GB',
            vram: '2 GB',
            disk: '2 GB',
            cpu: 'Any',
            speed: 'Fast'
        },
        description: 'Lightweight model with good performance'
    },
    'llama-3.2-1b': {
        name: 'Llama 3.2 1B',
        size: '1.2 GB',
        sizeBytes: 1288490188,
        url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
        source: 'Hugging Face (Meta)',
        requirements: {
            ram: '3 GB',
            vram: '1.5 GB',
            disk: '2 GB',
            cpu: 'Any',
            speed: 'Fast'
        },
        description: 'Small but capable model from Meta'
    },
    'mistral-7b': {
        name: 'Mistral 7B',
        size: '4.1 GB',
        sizeBytes: 4402341888,
        url: 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf',
        source: 'Hugging Face (Mistral AI)',
        requirements: {
            ram: '8 GB',
            vram: '4 GB',
            disk: '5 GB',
            cpu: 'Multi-core recommended',
            speed: 'Medium'
        },
        description: 'Balanced model with excellent performance'
    },
    'llama-3.1-8b': {
        name: 'Llama 3.1 8B',
        size: '4.7 GB',
        sizeBytes: 5046586572,
        url: 'https://huggingface.co/bartowski/Llama-3.1-8B-Instruct-GGUF/resolve/main/Llama-3.1-8B-Instruct-Q4_K_M.gguf',
        source: 'Hugging Face (Meta)',
        requirements: {
            ram: '10 GB',
            vram: '5 GB',
            disk: '6 GB',
            cpu: 'Multi-core recommended',
            speed: 'Medium'
        },
        description: 'High-quality model with great capabilities'
    },
    'llama-3.1-70b': {
        name: 'Llama 3.1 70B',
        size: '39 GB',
        sizeBytes: 41875931136,
        url: 'https://huggingface.co/bartowski/Llama-3.1-70B-Instruct-GGUF/resolve/main/Llama-3.1-70B-Instruct-Q4_K_M.gguf',
        source: 'Hugging Face (Meta)',
        requirements: {
            ram: '80 GB',
            vram: '40 GB',
            disk: '45 GB',
            cpu: 'High-end multi-core',
            speed: 'Slow (requires powerful hardware)'
        },
        description: 'Large model for maximum quality (requires powerful hardware)'
    }
};

class ModelDownloader {
    constructor() {
        const { PlatformUtils } = require('./platform-utils');
        // Use platform-appropriate models directory
        const configDir = PlatformUtils.getConfigDir('vox-browser');
        this.modelsDir = path.join(configDir, 'models');
        this.ensureModelsDir();
    }

    ensureModelsDir() {
        if (!fs.existsSync(this.modelsDir)) {
            fs.mkdirSync(this.modelsDir, { recursive: true });
        }
    }

    getAvailableModels() {
        return Object.keys(MODEL_SOURCES).map(key => ({
            id: key,
            ...MODEL_SOURCES[key]
        }));
    }

    getModelInfo(modelId) {
        return MODEL_SOURCES[modelId];
    }

    async downloadModel(modelId, progressCallback) {
        const modelInfo = MODEL_SOURCES[modelId];
        if (!modelInfo) {
            throw new Error(`Model ${modelId} not found`);
        }

        const fileName = path.basename(modelInfo.url);
        const filePath = path.join(this.modelsDir, fileName);

        // Check if model already exists
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size === modelInfo.sizeBytes) {
                return { success: true, path: filePath, cached: true };
            }
        }

        return new Promise((resolve, reject) => {
            const url = new URL(modelInfo.url);
            const protocol = url.protocol === 'https:' ? https : http;

            const file = fs.createWriteStream(filePath);
            let downloadedBytes = 0;

            const request = protocol.get(url.href, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: ${response.statusCode}`));
                    return;
                }

                const totalBytes = parseInt(response.headers['content-length'] || '0', 10);

                response.on('data', (chunk) => {
                    downloadedBytes += chunk.length;
                    if (progressCallback) {
                        const progress = totalBytes > 0 
                            ? Math.round((downloadedBytes / totalBytes) * 100)
                            : 0;
                        progressCallback(progress, downloadedBytes, totalBytes);
                    }
                    file.write(chunk);
                });

                response.on('end', () => {
                    file.end();
                    resolve({ success: true, path: filePath, cached: false });
                });
            });

            request.on('error', (error) => {
                fs.unlinkSync(filePath);
                reject(error);
            });

            file.on('error', (error) => {
                fs.unlinkSync(filePath);
                reject(error);
            });
        });
    }

    getModelSize(modelId) {
        const model = MODEL_SOURCES[modelId];
        return model ? model.sizeBytes : 0;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

module.exports = { ModelDownloader, MODEL_SOURCES };

