const { ipcRenderer } = require('electron');

let managersReady = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeBrowser();
    setupEventListeners();
});

function initializeBrowser() {
    const webview = document.getElementById('webview');
    
    // Performance: Throttle status updates
    let statusUpdateTimeout;
    const throttledStatusUpdate = (text) => {
        clearTimeout(statusUpdateTimeout);
        statusUpdateTimeout = setTimeout(() => updateStatus(text), 100);
    };
    
    webview.addEventListener('did-start-loading', () => {
        throttledStatusUpdate('Loading...');
    });
    
    webview.addEventListener('did-stop-loading', () => {
        updateStatus('Ready');
        updateAddressBar(webview.getURL());
    });
    
    webview.addEventListener('did-fail-load', (event) => {
        updateStatus('Failed to load: ' + event.errorDescription);
    });
    
    webview.addEventListener('page-title-updated', (event) => {
        if (event.title) {
            // Throttle title updates
            clearTimeout(statusUpdateTimeout);
            statusUpdateTimeout = setTimeout(() => {
                document.title = event.title + ' - Vox Browser';
            }, 200);
        }
    });

    // Performance: Optimize webview settings
    webview.setAttribute('allowpopups', 'true');
    webview.setAttribute('disablewebsecurity', 'false');
}

function setupEventListeners() {
    // Navigation buttons
    document.getElementById('back-btn').addEventListener('click', () => {
        const webview = document.getElementById('webview');
        if (webview.canGoBack()) {
            webview.goBack();
        }
    });
    
    document.getElementById('forward-btn').addEventListener('click', () => {
        const webview = document.getElementById('webview');
        if (webview.canGoForward()) {
            webview.goForward();
        }
    });
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        const webview = document.getElementById('webview');
        webview.reload();
    });
    
    document.getElementById('home-btn').addEventListener('click', () => {
        navigateTo('about:blank');
    });
    
    // Address bar
    const addressBar = document.getElementById('address-bar');
    addressBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigate();
        }
    });
    
    document.getElementById('go-btn').addEventListener('click', navigate);
    
    // vGuard Security Dashboard
    document.getElementById('vguard-btn').addEventListener('click', () => {
        toggleVGuardPanel();
    });
    
    document.getElementById('close-vguard-btn').addEventListener('click', () => {
        toggleVGuardPanel();
    });
    
    document.getElementById('vguard-enabled').addEventListener('change', async (e) => {
        const enabled = e.target.checked;
        await ipcRenderer.invoke('vguard-toggle', enabled);
        updateVGuardStats();
    });
    
    document.getElementById('reset-stats-btn').addEventListener('click', async () => {
        await ipcRenderer.invoke('vguard-reset-stats');
        updateVGuardStats();
    });
    
    // AI Assistant
    document.getElementById('ai-btn').addEventListener('click', () => {
        toggleAIPanel();
    });
    
    document.getElementById('close-ai-btn').addEventListener('click', () => {
        toggleAIPanel();
    });
    
    document.getElementById('ai-send-btn').addEventListener('click', sendAIQuery);
    
    const aiInput = document.getElementById('ai-input');
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAIQuery();
        }
    });
    
    document.getElementById('ai-interactive-mode-btn').addEventListener('click', () => {
        toggleAIPanel();
        setTimeout(() => {
            showDisclaimer();
        }, 300);
    });
    
    // Interactive Mode
    document.getElementById('interactive-btn').addEventListener('click', () => {
        showDisclaimer();
    });
    
    document.getElementById('close-interactive-btn').addEventListener('click', () => {
        toggleInteractivePanel();
    });
    
    document.getElementById('interactive-send-btn').addEventListener('click', executeInteractiveTask);
    
    const interactiveInput = document.getElementById('interactive-input');
    interactiveInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeInteractiveTask();
        }
    });
    
    // Disclaimer
    document.getElementById('disclaimer-accept').addEventListener('change', (e) => {
        document.getElementById('disclaimer-accept-btn').disabled = !e.target.checked;
    });
    
    document.getElementById('disclaimer-accept-btn').addEventListener('click', () => {
        acceptDisclaimer();
    });
    
    document.getElementById('disclaimer-cancel').addEventListener('click', () => {
        hideDisclaimer();
    });
    
    // IPC Listeners
    ipcRenderer.on('managers-ready', (event, status) => {
        managersReady = true;
        updateIndicators(status);
        updateStatus('All systems ready');
        updateVGuardStats();
    });
    
    ipcRenderer.on('init-error', (event, error) => {
        updateStatus('Error: ' + error);
    });
    
    // vGuard listeners
    ipcRenderer.on('vguard-blocked', (event, data) => {
        updateVGuardStats();
    });
    
    ipcRenderer.on('tor-status-update', (event, status) => {
        updateTorStatus(status);
    });
    
    // Update vGuard stats periodically
    setInterval(() => {
        if (document.getElementById('vguard-panel').classList.contains('open')) {
            updateVGuardStats();
        }
    }, 1000);
    
    // Interactive Mode action handler
    ipcRenderer.on('interactive-action', async (event, { action, channel }) => {
        const webview = document.getElementById('webview');
        let result;
        
        try {
            switch (action.type) {
                case 'navigate':
                    result = await executeNavigate(action.url, webview);
                    break;
                case 'search':
                    result = await executeSearch(action.query, webview);
                    break;
                case 'click':
                    result = await executeClick(action.target, webview);
                    break;
                case 'fill':
                    result = await executeFill(action.field, action.value, webview);
                    break;
                case 'scroll':
                    result = await executeScroll(action.direction, webview);
                    break;
                case 'wait':
                    await sleep(action.seconds * 1000);
                    result = { success: true, message: `Waited ${action.seconds} seconds` };
                    break;
                default:
                    result = { success: false, error: 'Unknown action type' };
            }
        } catch (error) {
            result = { success: false, error: error.message };
        }
        
        ipcRenderer.send(channel, result);
    });
}

async function executeNavigate(url, webview) {
    webview.src = url;
    await sleep(2000);
    return { success: true, message: `Navigated to ${url}` };
}

async function executeSearch(query, webview) {
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    webview.src = searchUrl;
    await sleep(2000);
    return { success: true, message: `Searched for: ${query}` };
}

async function executeClick(target, webview) {
    const script = `
        (function() {
            const elements = document.querySelectorAll('a, button, input[type="submit"], [role="button"]');
            for (const el of elements) {
                const text = el.textContent || el.value || el.alt || '';
                if (text.toLowerCase().includes('${target.toLowerCase()}')) {
                    el.click();
                    return { success: true, element: text };
                }
            }
            return { success: false, error: 'Element not found' };
        })();
    `;
    
    const result = await webview.executeJavaScript(script);
    await sleep(1000);
    return result;
}

async function executeFill(field, value, webview) {
    const script = `
        (function() {
            const inputs = document.querySelectorAll('input, textarea, select');
            for (const input of inputs) {
                const name = input.name || input.id || input.placeholder || '';
                if (name.toLowerCase().includes('${field.toLowerCase()}')) {
                    input.value = '${value}';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    return { success: true, field: name };
                }
            }
            return { success: false, error: 'Field not found' };
        })();
    `;
    
    const result = await webview.executeJavaScript(script);
    await sleep(500);
    return result;
}

async function executeScroll(direction, webview) {
    const script = `
        (function() {
            window.scrollBy(0, ${direction === 'down' ? '500' : '-500'});
            return { success: true, direction: '${direction}' };
        })();
    `;
    
    const result = await webview.executeJavaScript(script);
    await sleep(500);
    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Privacy-focused search engines (no Google)
const SEARCH_ENGINES = {
    'duckduckgo': 'https://duckduckgo.com/?q=',
    'startpage': 'https://www.startpage.com/sp/search?query=',
    'searx': 'https://searx.org/search?q=',
    'qwant': 'https://www.qwant.com/?q=',
    'default': 'https://duckduckgo.com/?q='
};

function getDefaultSearchEngine() {
    // Default to DuckDuckGo (privacy-focused, no Google)
    return SEARCH_ENGINES.default;
}

function navigate() {
    const addressBar = document.getElementById('address-bar');
    let url = addressBar.value.trim();
    
    if (!url) return;
    
    // Check if it's a search query (not a URL)
    if (!url.includes('.') && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
        // Treat as search query - use privacy-focused search engine
        const searchUrl = getDefaultSearchEngine() + encodeURIComponent(url);
        navigateTo(searchUrl);
        return;
    }
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
        url = 'https://' + url;
    }
    
    navigateTo(url);
}

function navigateTo(url) {
    const webview = document.getElementById('webview');
    webview.src = url;
    document.getElementById('address-bar').value = url;
}

function updateAddressBar(url) {
    if (url && url !== 'about:blank') {
        document.getElementById('address-bar').value = url;
    }
}

function updateStatus(text) {
    document.getElementById('status-text').textContent = text;
}

function updateIndicators(status) {
    const torIndicator = document.getElementById('tor-indicator');
    const protonIndicator = document.getElementById('proton-indicator');
    
    if (status.tor) {
        torIndicator.classList.add('active');
    }
    
    if (status.proton) {
        protonIndicator.classList.add('active');
    }
}

function toggleVGuardPanel() {
    const panel = document.getElementById('vguard-panel');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        updateVGuardStats();
        updateTorStatusFromVGuard();
    }
}

async function updateVGuardStats() {
    try {
        const stats = await ipcRenderer.invoke('vguard-get-stats');
        document.getElementById('ads-blocked').textContent = stats.adsBlocked;
        document.getElementById('trackers-blocked').textContent = stats.trackersBlocked;
        document.getElementById('total-blocked').textContent = stats.totalBlocked;
    } catch (error) {
        console.error('Failed to get vGuard stats:', error);
    }
}

async function updateTorStatusFromVGuard() {
    try {
        const torStatus = await ipcRenderer.invoke('vguard-get-tor-status');
        updateTorStatus(torStatus);
    } catch (error) {
        console.error('Failed to get Tor status:', error);
    }
}

function updateTorStatus(status) {
    const dot = document.getElementById('tor-status-dot');
    const text = document.getElementById('tor-status-text');
    
    if (status.active || status.connected) {
        dot.classList.add('active');
        dot.classList.remove('inactive');
        text.textContent = 'Connected';
    } else {
        dot.classList.add('inactive');
        dot.classList.remove('active');
        text.textContent = 'Disconnected';
    }
}

function toggleAIPanel() {
    const panel = document.getElementById('ai-panel');
    panel.classList.toggle('open');
}

async function sendAIQuery() {
    const input = document.getElementById('ai-input');
    const query = input.value.trim();
    
    if (!query || !managersReady) return;
    
    // Add user message
    addAIMessage(query, 'user');
    input.value = '';
    
    // Show loading
    const loadingMsg = addAIMessage('Thinking...', 'assistant');
    
    try {
        const response = await ipcRenderer.invoke('ai-query', query);
        loadingMsg.querySelector('p').textContent = response;
    } catch (error) {
        loadingMsg.querySelector('p').textContent = 'Error: ' + error.message;
    }
}

function addAIMessage(text, type) {
    const chat = document.getElementById('ai-chat');
    const message = document.createElement('div');
    message.className = 'ai-message ' + type;
    message.innerHTML = `<p>${text}</p>`;
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
    return message;
}

// Interactive Mode Functions
function showDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    modal.classList.add('show');
    document.getElementById('disclaimer-accept').checked = false;
    document.getElementById('disclaimer-accept-btn').disabled = true;
}

function hideDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    modal.classList.remove('show');
}

async function acceptDisclaimer() {
    hideDisclaimer();
    await ipcRenderer.invoke('interactive-toggle', true);
    toggleInteractivePanel();
    updateInteractiveStatus();
}

function toggleInteractivePanel() {
    const panel = document.getElementById('interactive-panel');
    const btn = document.getElementById('interactive-btn');
    panel.classList.toggle('open');
    
    if (panel.classList.contains('open')) {
        btn.classList.add('active');
        updateInteractiveStatus();
        loadTaskHistory();
    } else {
        btn.classList.remove('active');
    }
}

async function executeInteractiveTask() {
    const input = document.getElementById('interactive-input');
    const task = input.value.trim();
    
    if (!task) return;
    
    const sendBtn = document.getElementById('interactive-send-btn');
    sendBtn.disabled = true;
    
    // Add user message
    addInteractiveMessage(`Task: ${task}`, 'user');
    input.value = '';
    
    // Update status
    updateInteractiveStatus('Processing...', 'processing');
    
    try {
        const result = await ipcRenderer.invoke('interactive-execute', task);
        
        if (result.success) {
            addInteractiveMessage(`✓ Task completed successfully!`, 'success');
            if (result.results && result.results.length > 0) {
                result.results.forEach(r => {
                    if (r.message) {
                        addInteractiveMessage(r.message, 'success');
                    }
                });
            }
        } else {
            addInteractiveMessage(`✗ Task failed: ${result.error || 'Unknown error'}`, 'error');
        }
        
        loadTaskHistory();
    } catch (error) {
        addInteractiveMessage(`✗ Error: ${error.message}`, 'error');
    } finally {
        sendBtn.disabled = false;
        updateInteractiveStatus('Ready', 'ready');
    }
}

function addInteractiveMessage(text, type) {
    const chat = document.getElementById('interactive-chat');
    const message = document.createElement('div');
    message.className = 'interactive-message';
    
    if (type === 'user') {
        message.style.background = '#2a4a6a';
        message.style.borderLeftColor = '#4a9eff';
    } else if (type === 'success') {
        message.style.borderLeftColor = '#4a9eff';
    } else if (type === 'error') {
        message.style.borderLeftColor = '#ff4444';
    }
    
    message.innerHTML = `<p>${text}</p>`;
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
    return message;
}

async function updateInteractiveStatus(text, status) {
    const statusText = document.getElementById('interactive-status-text');
    const statusDot = document.getElementById('interactive-status-dot');
    
    statusText.textContent = text || 'Ready';
    
    statusDot.className = 'status-dot';
    if (status === 'processing') {
        statusDot.classList.add('active');
    } else if (status === 'ready') {
        statusDot.style.background = '#4a9eff';
    }
}

async function loadTaskHistory() {
    try {
        const history = await ipcRenderer.invoke('interactive-get-history');
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<p style="color: #888; font-size: 12px;">No tasks yet</p>';
            return;
        }
        
        history.slice(-10).reverse().forEach(task => {
            const item = document.createElement('div');
            item.className = `history-item ${task.status}`;
            item.innerHTML = `
                <div><strong>${task.description}</strong></div>
                <div style="font-size: 11px; color: #888; margin-top: 4px;">
                    ${task.status} - ${new Date(task.startTime).toLocaleTimeString()}
                </div>
            `;
            historyList.appendChild(item);
        });
    } catch (error) {
        console.error('Failed to load task history:', error);
    }
}

