// sw.js - Khalid Web Agent Service Worker

class KhalidServiceWorker {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🚀 Khalid Web Agent Service Worker started');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Installation event
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });
        
        // Extension startup
        chrome.runtime.onStartup.addListener(() => {
            console.log('🔄 Khalid Web Agent starting up');
        });
        
        // Message handling
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open
        });
        
        // Tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });
        
        // Context menu (right-click menu)
        this.createContextMenus();
    }
    
    handleInstallation(details) {
        console.log('📦 Extension installed/updated:', details.reason);
        
        if (details.reason === 'install') {
            // First time installation
            this.showWelcomeNotification();
            this.setDefaultSettings();
        } else if (details.reason === 'update') {
            // Extension updated
            this.handleUpdate(details.previousVersion);
        }
    }
    
    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.type) {
                case 'GET_AGENT_STATUS':
                    sendResponse({ status: 'active', version: '1.0.0' });
                    break;
                    
                case 'EXECUTE_GLOBAL_COMMAND':
                    await this.executeGlobalCommand(message.command);
                    sendResponse({ success: true });
                    break;
                    
                case 'LOG_COMMAND':
                    await this.logCommand(message.command, message.result);
                    sendResponse({ success: true });
                    break;
                    
                default:
                    console.log('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    
    handleTabUpdate(tabId, changeInfo, tab) {
        // Inject content script when page is complete
        if (changeInfo.status === 'complete' && tab.url) {
            // Skip chrome:// and extension pages
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
                return;
            }
            
            // Ensure content script is injected
            this.injectContentScript(tabId);
        }
    }
    
    async injectContentScript(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['content.js']
            });
        } catch (error) {
            // Ignore errors (might be already injected)
            console.log('Content script injection skipped for tab:', tabId);
        }
    }
    
    createContextMenus() {
        chrome.contextMenus.removeAll(() => {
            chrome.contextMenus.create({
                id: 'khalid-execute-command',
                title: 'تنفيذ أمر خالد',
                contexts: ['page', 'selection']
            });
            
            chrome.contextMenus.create({
                id: 'khalid-help',
                title: 'مساعدة خالد',
                contexts: ['page']
            });
        });
        
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenuClick(info, tab);
        });
    }
    
    async handleContextMenuClick(info, tab) {
        switch (info.menuItemId) {
            case 'khalid-execute-command':
                if (info.selectionText) {
                    // Execute selected text as command
                    await this.executeCommandOnTab(tab.id, info.selectionText);
                } else {
                    // Open popup
                    chrome.action.openPopup();
                }
                break;
                
            case 'khalid-help':
                await this.showHelp(tab.id);
                break;
        }
    }
    
    async executeCommandOnTab(tabId, command) {
        try {
            const response = await chrome.tabs.sendMessage(tabId, {
                type: 'EXECUTE_COMMAND',
                command: command,
                settings: await this.getSettings()
            });
            
            if (response.success) {
                this.showNotification('تم تنفيذ الأمر بنجاح', 'success');
            } else {
                this.showNotification('فشل في تنفيذ الأمر', 'error');
            }
        } catch (error) {
            console.error('Error executing command on tab:', error);
            this.showNotification('خطأ في تنفيذ الأمر', 'error');
        }
    }
    
    async executeGlobalCommand(command) {
        // Handle global commands that affect browser behavior
        const normalizedCommand = command.toLowerCase();
        
        if (normalizedCommand.includes('افتح نافذة جديدة')) {
            await chrome.windows.create();
            return 'تم فتح نافذة جديدة';
        }
        
        if (normalizedCommand.includes('افتح تبويب جديد')) {
            const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.tabs.create({ windowId: currentTab.windowId });
            return 'تم فتح تبويب جديد';
        }
        
        if (normalizedCommand.includes('أغلق التبويب')) {
            const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.tabs.remove(currentTab.id);
            return 'تم إغلاق التبويب';
        }
        
        throw new Error('أمر عام غير مدعوم');
    }
    
    async showHelp(tabId) {
        const helpContent = `
            🤖 مرحباً بك في وكيل خالد الذكي!
            
            أمثلة على الأوامر المدعومة:
            
            📍 التنقل:
            • اذهب إلى google.com
            • افتح youtube.com
            
            ✍️ الكتابة:
            • اكتب في (البحث): وكيل ذكي
            • أدخل في (الاسم): خالد
            
            🖱️ النقر:
            • اضغط على زر البحث
            • انقر على الرابط الأول
            
            🔍 البحث:
            • ابحث عن الذكاء الاصطناعي
            
            📜 التمرير:
            • انزل في الصفحة
            • اصعد للأعلى
        `;
        
        await chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_HELP',
            content: helpContent
        });
    }
    
    async logCommand(command, result) {
        try {
            const { commandLog = [] } = await chrome.storage.local.get('commandLog');
            
            const logEntry = {
                command,
                result,
                timestamp: new Date().toISOString(),
                url: await this.getCurrentTabUrl()
            };
            
            // Keep last 50 commands
            const updatedLog = [logEntry, ...commandLog].slice(0, 50);
            
            await chrome.storage.local.set({ commandLog: updatedLog });
        } catch (error) {
            console.error('Error logging command:', error);
        }
    }
    
    async getCurrentTabUrl() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            return tab?.url || 'unknown';
        } catch {
            return 'unknown';
        }
    }
    
    async getSettings() {
        try {
            return await chrome.storage.sync.get({
                allowAllDomains: true,
                showNotifications: true
            });
        } catch (error) {
            console.error('Error getting settings:', error);
            return { allowAllDomains: true, showNotifications: true };
        }
    }
    
    async setDefaultSettings() {
        try {
            await chrome.storage.sync.set({
                allowAllDomains: true,
                showNotifications: true,
                firstRun: false
            });
        } catch (error) {
            console.error('Error setting default settings:', error);
        }
    }
    
    showWelcomeNotification() {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'مرحباً بك في وكيل خالد!',
            message: 'تم تثبيت الوكيل الذكي بنجاح. انقر على الأيقونة لبدء الاستخدام.'
        });
    }
    
    showNotification(title, type = 'info') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: title,
            message: ''
        });
    }
    
    handleUpdate(previousVersion) {
        console.log(`Updated from version ${previousVersion} to 1.0.0`);
        
        // Handle version-specific updates here
        // For example, migrate settings or data
    }
}

// Initialize the service worker
const khalidSW = new KhalidServiceWorker();