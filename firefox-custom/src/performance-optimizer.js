// Performance Optimizer - Optimizes browser for slow systems
const { app } = require('electron');

class PerformanceOptimizer {
    constructor() {
        this.optimizationLevel = 'auto'; // auto, low, medium, high
        this.systemInfo = this.detectSystem();
    }

    detectSystem() {
        const totalMemory = require('os').totalmem();
        const cpuCount = require('os').cpus().length;
        const platform = require('os').platform();

        return {
            totalMemory,
            cpuCount,
            platform,
            isLowEnd: totalMemory < 4 * 1024 * 1024 * 1024 || cpuCount < 2, // Less than 4GB RAM or < 2 cores
            isVeryLowEnd: totalMemory < 2 * 1024 * 1024 * 1024 || cpuCount === 1 // Less than 2GB RAM or 1 core
        };
    }

    optimize() {
        const system = this.systemInfo;

        if (system.isVeryLowEnd) {
            this.optimizeForVeryLowEnd();
        } else if (system.isLowEnd) {
            this.optimizeForLowEnd();
        } else {
            this.optimizeForStandard();
        }

        // Apply general optimizations
        this.applyGeneralOptimizations();
    }

    optimizeForVeryLowEnd() {
        console.log('Applying very low-end system optimizations...');
        
        // Disable hardware acceleration if causing issues
        try {
            app.disableHardwareAcceleration();
        } catch (e) {
            // Ignore if already disabled or not available
        }
        
        // Reduce process priority (don't block system)
        const platform = require('os').platform();
        if (platform === 'linux' || platform === 'darwin') {
            try {
                require('child_process').exec(`renice +10 -p ${process.pid}`);
            } catch (e) {
                // Ignore if renice fails
            }
        }

        // Limit concurrent operations
        this.maxConcurrentRequests = 2;
        this.enableLazyLoading = true;
        this.enableImageOptimization = true;
        this.disableAnimations = true;
    }

    optimizeForLowEnd() {
        console.log('Applying low-end system optimizations...');
        
        // Moderate optimizations
        this.maxConcurrentRequests = 4;
        this.enableLazyLoading = true;
        this.enableImageOptimization = true;
        this.disableAnimations = false;
    }

    optimizeForStandard() {
        console.log('Applying standard optimizations...');
        
        // Standard settings
        this.maxConcurrentRequests = 8;
        this.enableLazyLoading = false;
        this.enableImageOptimization = false;
        this.disableAnimations = false;
    }

    applyGeneralOptimizations() {
        // Set process priority
        const platform = require('os').platform();
        if (platform === 'win32') {
            try {
                process.setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL);
            } catch (e) {
                // Ignore if setPriority fails
            }
        } else if (platform === 'darwin') {
            // macOS: Use renice
            try {
                require('child_process').exec(`renice +5 -p ${process.pid}`);
            } catch (e) {
                // Ignore
            }
        }

        // Enable garbage collection hints
        if (global.gc) {
            setInterval(() => {
                try {
                    global.gc();
                } catch (e) {
                    // GC not available
                }
            }, 30000); // Every 30 seconds
        }
    }

    getOptimizationSettings() {
        return {
            maxConcurrentRequests: this.maxConcurrentRequests || 8,
            enableLazyLoading: this.enableLazyLoading || false,
            enableImageOptimization: this.enableImageOptimization || false,
            disableAnimations: this.disableAnimations || false,
            systemInfo: this.systemInfo
        };
    }

    optimizeWebview(webview) {
        const settings = this.getOptimizationSettings();

        // Inject performance optimizations into webview
        const optimizationScript = `
            (function() {
                // Disable animations on low-end systems
                if (${settings.disableAnimations}) {
                    const style = document.createElement('style');
                    style.textContent = '* { animation: none !important; transition: none !important; }';
                    document.head.appendChild(style);
                }

                // Lazy load images
                if (${settings.enableLazyLoading}) {
                    const images = document.querySelectorAll('img');
                    const imageObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    imageObserver.unobserve(img);
                                }
                            }
                        });
                    });
                    images.forEach(img => {
                        if (img.src) {
                            img.dataset.src = img.src;
                            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
                            imageObserver.observe(img);
                        }
                    });
                }

                // Optimize image loading
                if (${settings.enableImageOptimization}) {
                    const images = document.querySelectorAll('img');
                    images.forEach(img => {
                        img.loading = 'lazy';
                        if (!img.hasAttribute('decoding')) {
                            img.decoding = 'async';
                        }
                    });
                }

                // Limit resource-intensive operations
                if (${settings.maxConcurrentRequests < 8}) {
                    // Throttle requests
                    const originalFetch = window.fetch;
                    let activeRequests = 0;
                    const maxRequests = ${settings.maxConcurrentRequests};
                    const requestQueue = [];

                    window.fetch = function(...args) {
                        return new Promise((resolve, reject) => {
                            const executeRequest = () => {
                                if (activeRequests < maxRequests) {
                                    activeRequests++;
                                    originalFetch(...args)
                                        .then(resolve)
                                        .catch(reject)
                                        .finally(() => {
                                            activeRequests--;
                                            if (requestQueue.length > 0) {
                                                requestQueue.shift()();
                                            }
                                        });
                                } else {
                                    requestQueue.push(executeRequest);
                                }
                            };
                            executeRequest();
                        });
                    };
                }
            })();
        `;

        webview.addEventListener('dom-ready', () => {
            webview.executeJavaScript(optimizationScript).catch(() => {
                // Ignore errors
            });
        });
    }
}

module.exports = { PerformanceOptimizer };

