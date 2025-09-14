// Service Worker for Khalid Web Agent
// Handles background tasks and extension lifecycle

class KhalidServiceWorker {
    constructor() {
        this.init();
    }
    
    init() {
        // Install event
        chrome.runtime.onInstalled.addListener((details) => {
            console.log('وكيل خالد الذكي تم تثبيته');
            
            if (details.reason === 'install') {
                this.onFirstInstall();
            } else if (details.reason === 'update') {
                this.onUpdate(details.previousVersion);
            }
        });
        
        // Handle extension startup
        chrome.runtime.onStartup.addListener(() => {
            console.log('وكيل خالد الذكي تم تشغيله');
        });
        
        // Handle messages from content scripts and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
        });
        
        // Handle tab updates to inject content script if needed
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.handleTabUpdate(tabId, tab);
            }
        });
    }
    
    onFirstInstall() {
        // Set default settings
        chrome.storage.local.set({
            settings: {
                autoExecute: false,
                allowedDomains: ['*'],
                language: 'ar',
                debugMode: false
            },
            commands: [],
            lastCommand: ''
        });
        
        // Show welcome notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'وكيل خالد الذكي',
            message: 'تم تثبيت الإضافة بنجاح! اضغط على الأيقونة لبدء الاستخدام.'
        });
    }
    
    onUpdate(previousVersion) {
        console.log(`تم تحديث وكيل خالد من ${previousVersion} إلى ${chrome.runtime.getManifest().version}`);
        
        // Handle any migration logic here if needed
    }
    
    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'getSettings':
                this.getSettings(sendResponse);
                break;
                
            case 'saveSettings':
                this.saveSettings(request.settings, sendResponse);
                break;
                
            case 'saveCommand':
                this.saveCommand(request.command, sendResponse);
                break;
                
            case 'getCommands':
                this.getCommands(sendResponse);
                break;
                
            case 'clearCommands':
                this.clearCommands(sendResponse);
                break;
                
            default:
                sendResponse({error: 'Unknown action'});
        }
        
        return true; // Will respond asynchronously
    }
    
    async handleTabUpdate(tabId, tab) {
        // Check if we should inject content script
        try {
            const settings = await this.getStorageData('settings');
            
            if (settings && this.isDomainAllowed(tab.url, settings.allowedDomains)) {
                // Ensure content script is injected
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }).catch(error => {
                    // Content script might already be injected, ignore error
                    console.log('Content script injection skipped for tab:', tabId);
                });
            }
        } catch (error) {
            console.error('Error handling tab update:', error);
        }
    }
    
    isDomainAllowed(url, allowedDomains) {
        if (!url || !allowedDomains) return false;
        
        // Allow all domains if * is in the list
        if (allowedDomains.includes('*')) return true;
        
        try {
            const domain = new URL(url).hostname;
            return allowedDomains.some(allowed => 
                domain === allowed || domain.endsWith('.' + allowed)
            );
        } catch (error) {
            return false;
        }
    }
    
    async getSettings(sendResponse) {
        try {
            const result = await this.getStorageData('settings');
            sendResponse({success: true, settings: result});
        } catch (error) {
            sendResponse({success: false, error: error.message});
        }
    }
    
    async saveSettings(settings, sendResponse) {
        try {
            await chrome.storage.local.set({settings});
            sendResponse({success: true});
        } catch (error) {
            sendResponse({success: false, error: error.message});
        }
    }
    
    async saveCommand(command, sendResponse) {
        try {
            const result = await this.getStorageData('commands') || [];
            result.push({
                command,
                timestamp: Date.now(),
                url: ''
            });
            
            // Keep only last 50 commands
            if (result.length > 50) {
                result.splice(0, result.length - 50);
            }
            
            await chrome.storage.local.set({commands: result});
            sendResponse({success: true});
        } catch (error) {
            sendResponse({success: false, error: error.message});
        }
    }
    
    async getCommands(sendResponse) {
        try {
            const result = await this.getStorageData('commands') || [];
            sendResponse({success: true, commands: result});
        } catch (error) {
            sendResponse({success: false, error: error.message});
        }
    }
    
    async clearCommands(sendResponse) {
        try {
            await chrome.storage.local.set({commands: []});
            sendResponse({success: true});
        } catch (error) {
            sendResponse({success: false, error: error.message});
        }
    }
    
    getStorageData(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(result[key]);
                }
            });
        });
    }
}

// Initialize service worker
new KhalidServiceWorker();