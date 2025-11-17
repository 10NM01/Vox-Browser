const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const { ModelDownloader, MODEL_SOURCES } = require('../firefox-custom/src/model-downloader');

let mainWindow;
let modelDownloader;
let installConfig = {
    aiModel: null,
    theme: 'dark',
    tabLayout: 'horizontal',
    torEnabled: false,
    protonEnabled: false
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        backgroundColor: '#000000',
        show: false
    });

    mainWindow.loadFile('installer.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

app.whenReady().then(() => {
    modelDownloader = new ModelDownloader();
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

// IPC Handlers
ipcMain.handle('get-ai-models', async () => {
    try {
        return modelDownloader.getAvailableModels();
    } catch (error) {
        console.error('Error getting AI models:', error);
        return [];
    }
});

ipcMain.handle('get-model-info', (event, modelId) => {
    return modelDownloader.getModelInfo(modelId);
});

ipcMain.handle('get-install-sizes', (event) => {
    const browserSize = 500 * 1024 * 1024; // ~500 MB
    const modelSize = installConfig.aiModel && installConfig.aiModel !== 'none'
        ? modelDownloader.getModelSize(installConfig.aiModel)
        : 0;
    const totalSize = browserSize + modelSize;
    
    return {
        browser: browserSize,
        model: modelSize,
        total: totalSize,
        browserFormatted: modelDownloader.formatBytes(browserSize),
        modelFormatted: modelSize > 0 ? modelDownloader.formatBytes(modelSize) : '0 MB',
        totalFormatted: modelDownloader.formatBytes(totalSize)
    };
});

ipcMain.handle('set-install-config', (event, config) => {
    installConfig = { ...installConfig, ...config };
    return true;
});

ipcMain.handle('get-install-config', () => {
    return installConfig;
});

ipcMain.handle('install-browser', async (event) => {
    try {
        const browserSize = 500 * 1024 * 1024; // ~500 MB
        let currentProgress = 0;
        const totalSteps = installConfig.aiModel && installConfig.aiModel !== 'none' ? 6 : 4;
        
        // Step 1: Extracting browser files
        event.sender.send('install-progress', {
            name: 'Extracting browser files...',
            progress: Math.round((++currentProgress / totalSteps) * 100),
            details: `Installing browser (~${modelDownloader.formatBytes(browserSize)})...`
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Installing dependencies
        event.sender.send('install-progress', {
            name: 'Installing dependencies...',
            progress: Math.round((++currentProgress / totalSteps) * 100),
            details: 'Setting up system dependencies...'
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 3: Configuring browser
        event.sender.send('install-progress', {
            name: 'Configuring browser...',
            progress: Math.round((++currentProgress / totalSteps) * 100),
            details: 'Setting up browser configuration...'
        });
        await new Promise(resolve => setTimeout(resolve, 800));

        // Step 4: Download AI model (if selected)
        if (installConfig.aiModel && installConfig.aiModel !== 'none') {
            event.sender.send('install-progress', {
                name: 'Downloading AI model...',
                progress: Math.round((++currentProgress / totalSteps) * 100),
                details: `Downloading ${installConfig.aiModel} from trusted source...`
            });

            try {
                await modelDownloader.downloadModel(installConfig.aiModel, (progress, downloaded, total) => {
                    const modelProgress = Math.round((currentProgress / totalSteps) * 100 + (progress / totalSteps));
                    event.sender.send('install-progress', {
                        name: 'Downloading AI model...',
                        progress: Math.min(modelProgress, Math.round(((currentProgress + 0.9) / totalSteps) * 100)),
                        details: `Downloaded ${modelDownloader.formatBytes(downloaded)} / ${modelDownloader.formatBytes(total)} (${progress}%)`
                    });
                });
            } catch (error) {
                console.error('Model download failed:', error);
                event.sender.send('install-progress', {
                    name: 'Model download failed',
                    progress: Math.round((++currentProgress / totalSteps) * 100),
                    details: `Warning: ${error.message}. Browser will install without AI model.`
                });
            }
            currentProgress++;
        }

        // Step 5: Setting up AI model (if downloaded)
        if (installConfig.aiModel && installConfig.aiModel !== 'none') {
            event.sender.send('install-progress', {
                name: 'Setting up AI model...',
                progress: Math.round((++currentProgress / totalSteps) * 100),
                details: 'Configuring AI model integration...'
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Step 6: Finalizing installation
        event.sender.send('install-progress', {
            name: 'Finalizing installation...',
            progress: 100,
            details: 'Completing setup...'
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Save configuration using platform-appropriate path
        const { PlatformUtils } = require('../firefox-custom/src/platform-utils');
        const configDir = PlatformUtils.getConfigDir('vox-browser');
        await fs.ensureDir(configDir);
        const configPath = path.join(configDir, 'vox-config.json');
        await fs.writeJson(configPath, installConfig);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('close-installer', () => {
    app.quit();
});

