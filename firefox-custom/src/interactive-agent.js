// Interactive Mode (Beta) - AI Browser Agent
// Local AI agent that can control the browser and perform tasks

class InteractiveAgent {
    constructor() {
        this.enabled = false;
        this.currentTask = null;
        this.taskHistory = [];
        this.isProcessing = false;
    }

    get isProcessing() {
        return this._isProcessing || false;
    }

    set isProcessing(value) {
        this._isProcessing = value;
    }

    async executeTask(taskDescription, mainWindow) {
        if (this.isProcessing) {
            return { error: 'Another task is already in progress' };
        }

        this.isProcessing = true;
        this.currentTask = {
            description: taskDescription,
            startTime: new Date(),
            status: 'processing'
        };

        try {
            // Parse the task and determine actions
            const actions = this.parseTask(taskDescription);
            const results = [];

            // Send actions to renderer process to execute on webview
            const { ipcMain } = require('electron');
            
            for (const action of actions) {
                const result = await new Promise((resolve) => {
                    // Use a unique channel per action to avoid conflicts
                    const channel = `interactive-action-result-${Date.now()}-${Math.random()}`;
                    
                    const timeoutId = setTimeout(() => {
                        ipcMain.removeListener(channel, handler);
                        resolve({ success: false, error: 'Action timeout' });
                    }, 30000);
                    
                    const handler = (event, result) => {
                        clearTimeout(timeoutId);
                        ipcMain.removeListener(channel, handler);
                        resolve(result);
                    };
                    
                    ipcMain.once(channel, handler);
                    mainWindow.webContents.send('interactive-action', { action, channel });
                });
                
                results.push(result);
                
                // Small delay between actions
                await this.sleep(500);
            }

            this.currentTask.status = 'completed';
            this.currentTask.endTime = new Date();
            this.taskHistory.push(this.currentTask);

            return {
                success: true,
                results: results,
                task: this.currentTask
            };
        } catch (error) {
            this.currentTask.status = 'failed';
            this.currentTask.error = error.message;
            return {
                success: false,
                error: error.message,
                task: this.currentTask
            };
        } finally {
            this.isProcessing = false;
            this.currentTask = null;
        }
    }

    parseTask(description) {
        const lowerDesc = description.toLowerCase();
        const actions = [];

        // Navigation tasks
        if (lowerDesc.includes('go to') || lowerDesc.includes('navigate to') || lowerDesc.includes('open')) {
            const urlMatch = description.match(/(?:go to|navigate to|open)\s+(?:the\s+)?(?:website\s+)?(?:url\s+)?([^\s]+(?:\.[^\s]+)+)/i);
            if (urlMatch) {
                let url = urlMatch[1];
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                actions.push({ type: 'navigate', url: url });
            }
        }

        // Search tasks
        if (lowerDesc.includes('search for') || lowerDesc.includes('look up') || lowerDesc.includes('find')) {
            const searchMatch = description.match(/(?:search for|look up|find)\s+(.+?)(?:\s+on|\s+in|$)/i);
            if (searchMatch) {
                const query = searchMatch[1].trim();
                actions.push({ type: 'search', query: query });
            }
        }

        // Click tasks
        if (lowerDesc.includes('click') || lowerDesc.includes('press') || lowerDesc.includes('select')) {
            const clickMatch = description.match(/(?:click|press|select)\s+(?:on\s+)?(?:the\s+)?(.+?)(?:\s+button|\s+link|\s+element)?$/i);
            if (clickMatch) {
                actions.push({ type: 'click', target: clickMatch[1].trim() });
            }
        }

        // Fill form tasks
        if (lowerDesc.includes('fill') || lowerDesc.includes('enter') || lowerDesc.includes('type')) {
            const fillMatch = description.match(/(?:fill|enter|type)\s+(.+?)\s+(?:in|into|on)\s+(.+)/i);
            if (fillMatch) {
                actions.push({
                    type: 'fill',
                    value: fillMatch[1].trim(),
                    field: fillMatch[2].trim()
                });
            }
        }

        // Scroll tasks
        if (lowerDesc.includes('scroll')) {
            if (lowerDesc.includes('down')) {
                actions.push({ type: 'scroll', direction: 'down' });
            } else if (lowerDesc.includes('up')) {
                actions.push({ type: 'scroll', direction: 'up' });
            }
        }

        // Wait tasks
        if (lowerDesc.includes('wait')) {
            const waitMatch = description.match(/wait\s+(\d+)\s*(?:second|sec|s)?/i);
            if (waitMatch) {
                actions.push({ type: 'wait', seconds: parseInt(waitMatch[1]) });
            }
        }

        // If no specific actions found, treat as general instruction
        if (actions.length === 0) {
            actions.push({ type: 'general', description: description });
        }

        return actions;
    }

    async executeAction(action, webview) {
        // This is handled in the renderer process
        return { message: 'Action queued' };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.currentTask = null;
    }

    isEnabled() {
        return this.enabled;
    }

    getTaskHistory() {
        return this.taskHistory;
    }

    getCurrentTask() {
        return this.currentTask;
    }
}

module.exports = { InteractiveAgent };

