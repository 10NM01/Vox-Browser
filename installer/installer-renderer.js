const { ipcRenderer } = require('electron');

let currentStage = 1;
let aiModels = [];
let selectedModel = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadAIModels();
    setupEventListeners();
});

async function loadAIModels() {
    try {
        aiModels = await ipcRenderer.invoke('get-ai-models');
        const select = document.getElementById('ai-model-select');
        
        // Clear existing options except "None"
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        aiModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.name} (${model.size}) - ${model.description}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load AI models:', error);
    }
}

function setupEventListeners() {
    // Model selection change
    document.getElementById('ai-model-select').addEventListener('change', async (e) => {
        const modelId = e.target.value;
        if (modelId === 'none') {
            document.getElementById('model-info').style.display = 'none';
            selectedModel = null;
        } else {
            selectedModel = await ipcRenderer.invoke('get-model-info', modelId);
            displayModelInfo(selectedModel);
        }
    });

    // Pre-install stage - Continue to confirmation
    document.getElementById('continue-to-confirm-btn').addEventListener('click', async () => {
        const aiModel = document.getElementById('ai-model-select').value;
        await ipcRenderer.invoke('set-install-config', { aiModel: aiModel === 'none' ? null : aiModel });
        goToStage(2);
        await updateConfirmationPage();
    });

    // Confirmation stage - Back to model selection
    document.getElementById('back-to-model-btn').addEventListener('click', () => {
        goToStage(1);
    });

    // Confirmation stage - Confirm and install
    document.getElementById('confirm-install-btn').addEventListener('click', async () => {
        goToStage(3);
        await startInstallation();
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        ipcRenderer.invoke('close-installer');
    });

    // Post-install stage
    document.getElementById('finish-btn').addEventListener('click', async () => {
        const config = {
            theme: document.getElementById('theme-select').value,
            tabLayout: document.getElementById('tab-layout-select').value,
            torEnabled: document.getElementById('tor-enabled').checked,
            protonEnabled: document.getElementById('proton-enabled').checked
        };
        
        await ipcRenderer.invoke('set-install-config', config);
        ipcRenderer.invoke('close-installer');
    });

    // Listen for install progress
    ipcRenderer.on('install-progress', (event, data) => {
        updateProgress(data.progress, data.name, data.details);
    });
}

function displayModelInfo(model) {
    if (!model) return;
    
    document.getElementById('model-info').style.display = 'block';
    document.getElementById('model-name').textContent = model.name;
    document.getElementById('model-description').textContent = model.description;
    document.getElementById('req-size').textContent = model.size;
    document.getElementById('req-ram').textContent = model.requirements.ram;
    document.getElementById('req-vram').textContent = model.requirements.vram;
    document.getElementById('req-disk').textContent = model.requirements.disk;
    document.getElementById('req-cpu').textContent = model.requirements.cpu;
    document.getElementById('req-speed').textContent = model.requirements.speed;
    document.getElementById('model-source').textContent = model.source;
}

async function updateConfirmationPage() {
    const sizes = await ipcRenderer.invoke('get-install-sizes');
    const config = await ipcRenderer.invoke('get-install-config');
    
    document.getElementById('browser-size').textContent = sizes.browserFormatted;
    document.getElementById('total-size').textContent = sizes.totalFormatted;
    
    if (config.aiModel && config.aiModel !== 'none') {
        const modelInfo = await ipcRenderer.invoke('get-model-info', config.aiModel);
        document.getElementById('model-summary-item').style.display = 'flex';
        document.getElementById('model-size').textContent = sizes.modelFormatted;
        document.getElementById('selected-model-name').textContent = modelInfo.name;
    } else {
        document.getElementById('model-summary-item').style.display = 'none';
        document.getElementById('selected-model-name').textContent = 'None';
    }
}

function goToStage(stage) {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(s => {
        s.style.display = 'none';
    });

    // Show current stage
    document.getElementById(`stage-${stage}`).style.display = 'flex';

    // Update stage indicators
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`stage-${i}-dot`);
        if (i <= stage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    }

    currentStage = stage;
}

async function startInstallation() {
    const result = await ipcRenderer.invoke('install-browser');
    
    if (result.success) {
        setTimeout(() => {
            goToStage(4);
        }, 500);
    } else {
        alert('Installation failed: ' + result.error);
        goToStage(2); // Go back to confirmation
    }
}

function updateProgress(percentage, text, details) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressDetails = document.getElementById('progress-details');

    progressBar.style.width = percentage + '%';
    progressText.textContent = text;
    progressPercentage.textContent = percentage + '%';
    
    if (details) {
        progressDetails.textContent = details;
        progressDetails.style.display = 'block';
    } else {
        progressDetails.style.display = 'none';
    }
}
