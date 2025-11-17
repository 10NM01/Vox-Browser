const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { TorManager } = require('./src/tor-manager');
const { ProtonManager } = require('./src/proton-manager');
const { AIManager } = require('./src/ai-manager');
const { PrivacyManager } = require('./src/privacy-manager');
const { VGuard } = require('./src/vguard');
const { DependencyInstaller } = require('./src/dependency-installer');
const { InteractiveAgent } = require('./src/interactive-agent');
const { PerformanceOptimizer } = require('./src/performance-optimizer');

let mainWindow;
let torManager;
let protonManager;
let aiManager;
let privacyManager;
let vGuard;
let interactiveAgent;
let performanceOptimizer;

function createWindow() {
  // Initialize performance optimizer
  performanceOptimizer = new PerformanceOptimizer();
  performanceOptimizer.optimize();

  const systemInfo = performanceOptimizer.getOptimizationSettings().systemInfo;
  
  // Adjust window size for low-end systems
  const windowWidth = systemInfo.isVeryLowEnd ? 1200 : 1400;
  const windowHeight = systemInfo.isVeryLowEnd ? 800 : 900;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      enableRemoteModule: false,
      // Block Google services and tracking
      partition: 'persist:main',
      // Performance optimizations
      backgroundThrottling: !systemInfo.isVeryLowEnd, // Don't throttle on very low-end
      offscreen: false,
      // Memory optimizations
      v8CacheOptions: 'code',
      spellcheck: false // Disable spellcheck for performance
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false,
    // Performance: Don't show until ready
    backgroundColor: '#1a1a1a'
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Optimize webview after it's ready
    const webview = mainWindow.webContents;
    if (webview) {
      performanceOptimizer.optimizeWebview(webview);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Memory management: Clear cache periodically on low-end systems
  if (systemInfo.isLowEnd) {
    setInterval(() => {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.session.clearCache();
      }
    }, 300000); // Every 5 minutes
  }

  // Initialize vGuard security dashboard
  vGuard = new VGuard();

  // Initialize Interactive Agent
  interactiveAgent = new InteractiveAgent();

  // De-google: Block Google services
  setupPrivacyFilters();

  // Initialize managers
  initializeManagers();
  
  // Start Tor status monitoring
  startTorStatusMonitoring();
}

function setupPrivacyFilters() {
  privacyManager = new PrivacyManager();

  // Set up content filtering - block tracking domains with vGuard
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    // Check vGuard first (ads and trackers)
    if (vGuard && vGuard.isEnabled()) {
      const vGuardResult = vGuard.isBlocked(details.url);
      if (vGuardResult.blocked) {
        console.log(`vGuard blocked ${vGuardResult.type}:`, details.url);
        if (mainWindow) {
          mainWindow.webContents.send('vguard-blocked', {
            url: details.url,
            type: vGuardResult.type,
            stats: vGuard.getStats()
          });
        }
        callback({ cancel: true });
        return;
      }
    }
    
    // Then check privacy manager
    if (privacyManager.isBlocked(details.url)) {
      console.log('Blocked:', details.url);
      callback({ cancel: true });
      return;
    }
    
    // Sanitize URL (remove tracking parameters)
    const sanitized = privacyManager.sanitizeUrl(details.url);
    if (sanitized !== details.url) {
      callback({ redirectURL: sanitized });
      return;
    }
    
    callback({});
  });

  // Remove tracking headers and referrers
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // Remove referrer for privacy
    if (details.requestHeaders['Referer']) {
      delete details.requestHeaders['Referer'];
    }
    
    // Remove tracking headers
    delete details.requestHeaders['X-Forwarded-For'];
    delete details.requestHeaders['X-Real-IP'];
    
    callback({ requestHeaders: details.requestHeaders });
  });

  // Block Google DNS and other privacy-invasive services
  session.defaultSession.setProxy({
    proxyRules: 'direct://',
    proxyBypassRules: 'localhost,127.0.0.1'
  });
}

async function initializeManagers() {
  try {
    // Initialize Tor
    torManager = new TorManager();
    await torManager.initialize();
    
    // Initialize Proton VPN
    protonManager = new ProtonManager();
    await protonManager.initialize();
    
    // Initialize AI Assistant
    aiManager = new AIManager();
    await aiManager.initialize();
    
    // Configure proxy settings
    await configureProxy();
    
    mainWindow.webContents.send('managers-ready', {
      tor: torManager.isActive(),
      proton: protonManager.isActive(),
      ai: aiManager.isReady()
    });
  } catch (error) {
    console.error('Failed to initialize managers:', error);
    mainWindow.webContents.send('init-error', error.message);
  }
}

async function configureProxy() {
  const proxyConfig = await torManager.getProxyConfig();
  
  if (proxyConfig) {
    session.defaultSession.setProxy({
      proxyRules: `${proxyConfig.host}:${proxyConfig.port}`,
      proxyBypassRules: 'localhost,127.0.0.1'
    });
  }
}

function startTorStatusMonitoring() {
  // Update Tor status every 2 seconds
  setInterval(() => {
    if (torManager && vGuard) {
      const torActive = torManager.isActive();
      vGuard.updateTorStatus({
        active: torActive,
        connected: torActive
      });
      
      if (mainWindow) {
        mainWindow.webContents.send('tor-status-update', {
          active: torActive,
          connected: torActive
        });
      }
    }
  }, 2000);
}

app.whenReady().then(async () => {
  // Check and install dependencies automatically
  const depInstaller = new DependencyInstaller();
  try {
    const result = await depInstaller.installAll();
    if (!result.success) {
      console.warn('Some dependencies failed to install:', result);
    }
  } catch (error) {
    console.warn('Dependency check failed:', error.message);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  // Cleanup
  if (torManager) await torManager.cleanup();
  if (protonManager) await protonManager.cleanup();
  if (aiManager) await aiManager.cleanup();
  
  // macOS: Keep app running even when all windows are closed
  const { PlatformUtils } = require('./src/platform-utils');
  if (!PlatformUtils.isMacOS()) {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('toggle-tor', async (event, enabled) => {
  if (enabled) {
    await torManager.start();
  } else {
    await torManager.stop();
  }
  await configureProxy();
  return torManager.isActive();
});

ipcMain.handle('toggle-proton', async (event, enabled) => {
  if (enabled) {
    await protonManager.connect();
  } else {
    await protonManager.disconnect();
  }
  return protonManager.isActive();
});

ipcMain.handle('ai-query', async (event, query) => {
  return await aiManager.query(query);
});

ipcMain.handle('navigate', async (event, url) => {
  if (mainWindow) {
    mainWindow.loadURL(url);
  }
});

// vGuard IPC Handlers
ipcMain.handle('vguard-toggle', (event, enabled) => {
  if (enabled) {
    vGuard.enable();
  } else {
    vGuard.disable();
  }
  return vGuard.isEnabled();
});

ipcMain.handle('vguard-get-stats', () => {
  return vGuard.getStats();
});

ipcMain.handle('vguard-reset-stats', () => {
  vGuard.resetStats();
  return vGuard.getStats();
});

ipcMain.handle('vguard-get-tor-status', () => {
  return vGuard.getTorStatus();
});

// Interactive Agent IPC Handlers
ipcMain.handle('interactive-execute', async (event, taskDescription) => {
  if (!interactiveAgent.isEnabled()) {
    return { error: 'Interactive Mode is not enabled' };
  }
  
  // Send task to renderer to execute on webview
  return await interactiveAgent.executeTask(taskDescription, mainWindow);
});

ipcMain.handle('interactive-toggle', (event, enabled) => {
  if (enabled) {
    interactiveAgent.enable();
  } else {
    interactiveAgent.disable();
  }
  return interactiveAgent.isEnabled();
});

ipcMain.handle('interactive-get-history', () => {
  return interactiveAgent.getTaskHistory();
});

ipcMain.handle('interactive-get-status', () => {
  return {
    enabled: interactiveAgent.isEnabled(),
    currentTask: interactiveAgent.getCurrentTask(),
    isProcessing: interactiveAgent.isProcessing
  };
});

