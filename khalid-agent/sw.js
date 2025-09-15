// Service Worker for Khalid Agent with Google Integration
// خدمة العمل الخلفية لوكيل خالد مع دمج جوجل

class KhalidServiceWorker {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeGoogleServices();
        console.log('خدمة وكيل خالد مع تقنيات جوجل بدأت العمل 🚀');
    }

    setupEventListeners() {
        // Extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.onFirstInstall();
            } else if (details.reason === 'update') {
                this.onUpdate(details.previousVersion);
            }
        });

        // Tab updates for Google services integration
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.handleTabUpdate(tabId, tab);
            }
        });

        // Message handling
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Context menu for Google AI features
        chrome.runtime.onStartup.addListener(() => {
            this.createContextMenus();
        });
    }

    onFirstInstall() {
        // Welcome setup
        chrome.tabs.create({
            url: 'https://wasl.store'
        });

        // Set default settings
        chrome.storage.sync.set({
            'khalid_version': '2.0',
            'google_integration': true,
            'ai_features_enabled': true,
            'auto_translate': false,
            'smart_suggestions': true,
            'install_date': new Date().toISOString()
        });

        // Show welcome notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'مرحباً بوكيل خالد الذكي!',
            message: 'تم دمج تقنيات جوجل المتطورة. اضغط Ctrl+Shift+K لبدء الاستخدام.'
        });
    }

    onUpdate(previousVersion) {
        chrome.storage.sync.set({
            'khalid_version': '2.0',
            'updated_from': previousVersion,
            'update_date': new Date().toISOString()
        });

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'تم تحديث وكيل خالد!',
            message: 'إضافة مميزات جديدة مع تقنيات جوجل المحسنة.'
        });
    }

    createContextMenus() {
        // Remove existing menus
        chrome.contextMenus.removeAll();

        // Main menu
        chrome.contextMenus.create({
            id: 'khalid-main',
            title: '🤖 وكيل خالد الذكي',
            contexts: ['page', 'selection', 'link']
        });

        // Google AI submenu
        chrome.contextMenus.create({
            id: 'khalid-ai-analyze',
            parentId: 'khalid-main',
            title: '🔍 تحليل بالذكاء الاصطناعي',
            contexts: ['page']
        });

        chrome.contextMenus.create({
            id: 'khalid-ai-summarize',
            parentId: 'khalid-main',
            title: '📄 تلخيص المحتوى',
            contexts: ['page', 'selection']
        });

        chrome.contextMenus.create({
            id: 'khalid-google-translate',
            parentId: 'khalid-main',
            title: '🌍 ترجمة مع جوجل',
            contexts: ['page', 'selection']
        });

        chrome.contextMenus.create({
            id: 'khalid-google-search',
            parentId: 'khalid-main',
            title: '🔍 بحث في جوجل',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'khalid-maps',
            parentId: 'khalid-main',
            title: '🗺️ البحث في الخرائط',
            contexts: ['selection']
        });

        // Handle context menu clicks
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenuClick(info, tab);
        });
    }

    handleContextMenuClick(info, tab) {
        const commands = {
            'khalid-ai-analyze': 'حلل الصفحة',
            'khalid-ai-summarize': 'لخص المحتوى',
            'khalid-google-translate': 'ترجم النص المحدد',
            'khalid-google-search': `ابحث في جوجل عن ${info.selectionText}`,
            'khalid-maps': `ابحث في الخرائط عن ${info.selectionText}`
        };

        const command = commands[info.menuItemId];
        if (command) {
            chrome.tabs.sendMessage(tab.id, {
                action: 'executeCommand',
                command: command,
                context: info
            });
        }
    }

    handleTabUpdate(tabId, tab) {
        // Inject enhanced features for Google sites
        if (tab.url.includes('google.com')) {
            this.enhanceGoogleSite(tabId, tab);
        }
        
        // Auto-suggest actions for WASL site
        if (tab.url.includes('wasl.store')) {
            this.enhanceWaslSite(tabId, tab);
        }

        // Track page visits for AI learning
        this.trackPageVisit(tab.url);
    }

    enhanceGoogleSite(tabId, tab) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: function() {
                // Enhanced Google site integration
                const notification = document.createElement('div');
                notification.innerHTML = `
                    <div style="position: fixed; top: 10px; right: 10px; background: #4285f4; 
                                color: white; padding: 10px; border-radius: 8px; z-index: 10000;
                                font-family: Arial, sans-serif; font-size: 12px; direction: rtl;">
                        🤖 وكيل خالد متاح للمساعدة في جوجل
                    </div>
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 3000);
            }
        });
    }

    enhanceWaslSite(tabId, tab) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: function() {
                // Enhanced WASL site integration
                const welcomeMsg = document.createElement('div');
                welcomeMsg.innerHTML = `
                    <div style="position: fixed; top: 10px; left: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                color: white; padding: 15px; border-radius: 12px; z-index: 10000;
                                font-family: Arial, sans-serif; direction: rtl; max-width: 250px;">
                        <strong>🎉 مرحباً في منصة وسل الذكية!</strong><br>
                        <small>استخدم وكيل خالد للتفاعل مع الموقع بالذكاء الاصطناعي</small>
                    </div>
                `;
                document.body.appendChild(welcomeMsg);
                
                setTimeout(() => {
                    if (welcomeMsg.parentNode) {
                        welcomeMsg.remove();
                    }
                }, 5000);
            }
        });
    }

    handleMessage(message, sender, sendResponse) {
        switch (message.action) {
            case 'getGoogleApiKey':
                this.getGoogleApiKey(sendResponse);
                break;
                
            case 'logAIInteraction':
                this.logAIInteraction(message.data);
                sendResponse({ success: true });
                break;
                
            case 'getSmartSuggestions':
                this.getSmartSuggestions(message.url, sendResponse);
                break;
                
            case 'updateSettings':
                this.updateSettings(message.settings, sendResponse);
                break;
                
            default:
                sendResponse({ error: 'Unknown action' });
        }
    }

    async getGoogleApiKey(sendResponse) {
        // In a real implementation, this would securely manage API keys
        const apiKeys = {
            maps: 'YOUR_GOOGLE_MAPS_API_KEY',
            translate: 'YOUR_GOOGLE_TRANSLATE_API_KEY',
            ai: 'YOUR_GOOGLE_AI_API_KEY'
        };
        
        sendResponse({ keys: apiKeys });
    }

    logAIInteraction(data) {
        // Log AI interactions for improvement
        chrome.storage.local.get(['ai_interactions'], (result) => {
            const interactions = result.ai_interactions || [];
            interactions.push({
                ...data,
                timestamp: new Date().toISOString(),
                version: '2.0'
            });
            
            // Keep only last 100 interactions
            if (interactions.length > 100) {
                interactions.splice(0, interactions.length - 100);
            }
            
            chrome.storage.local.set({ ai_interactions: interactions });
        });
    }

    getSmartSuggestions(url, sendResponse) {
        const suggestions = [];
        
        if (url.includes('google.com/search')) {
            suggestions.push({
                text: 'البحث عن منصة وسل',
                command: 'ابحث عن wasl.store'
            });
        } else if (url.includes('maps.google.com')) {
            suggestions.push({
                text: 'العودة لموقع وسل',
                command: 'اذهب إلى wasl.store'
            });
        } else if (url.includes('wasl.store')) {
            suggestions.push(
                {
                    text: 'تحليل الصفحة',
                    command: 'حلل الصفحة'
                },
                {
                    text: 'فتح الخريطة',
                    command: 'افتح الخريطة'
                },
                {
                    text: 'تسجيل الدخول',
                    command: 'اضغط تسجيل الدخول'
                }
            );
        }
        
        sendResponse({ suggestions });
    }

    updateSettings(settings, sendResponse) {
        chrome.storage.sync.set(settings, () => {
            sendResponse({ success: true });
        });
    }

    trackPageVisit(url) {
        // Simple analytics for AI improvement
        chrome.storage.local.get(['page_visits'], (result) => {
            const visits = result.page_visits || {};
            const domain = new URL(url).hostname;
            
            visits[domain] = (visits[domain] || 0) + 1;
            
            chrome.storage.local.set({ page_visits: visits });
        });
    }

    initializeGoogleServices() {
        // Initialize Google services integration
        chrome.storage.sync.get(['google_integration'], (result) => {
            if (result.google_integration !== false) {
                this.setupGoogleIntegration();
            }
        });
    }

    setupGoogleIntegration() {
        // Setup Google services
        console.log('🔧 إعداد خدمات جوجل...');
        
        // Create context menus
        this.createContextMenus();
        
        // Set up periodic tasks
        chrome.alarms.create('daily_sync', { periodInMinutes: 1440 }); // Daily
        
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'daily_sync') {
                this.performDailySync();
            }
        });
    }

    performDailySync() {
        // Daily maintenance tasks
        chrome.storage.local.get(['ai_interactions', 'page_visits'], (result) => {
            console.log('📊 إحصائيات يومية:', {
                interactions: result.ai_interactions?.length || 0,
                sites_visited: Object.keys(result.page_visits || {}).length
            });
        });
    }
}

// Initialize the service worker
const khalidSW = new KhalidServiceWorker();