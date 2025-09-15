// Service Worker for Khalid Agent
// وكيل خالد الذكي - Service Worker

// تثبيت الخدمة
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🤖 تم تثبيت وكيل خالد الذكي');
    
    if (details.reason === 'install') {
        // إعداد افتراضي عند التثبيت لأول مرة
        chrome.storage.local.set({
            agentSettings: {
                language: 'ar',
                autoComplete: true,
                notifications: true,
                commandHistory: []
            }
        });
        
        // فتح صفحة ترحيب
        chrome.tabs.create({
            url: chrome.runtime.getURL('welcome.html') || 'https://wasl.store'
        });
    }
});

// بدء تشغيل الخدمة
chrome.runtime.onStartup.addListener(() => {
    console.log('🚀 تم بدء تشغيل وكيل خالد الذكي');
});

// استقبال الرسائل من content scripts و popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender, sendResponse);
    return true; // يحافظ على قناة الاتصال مفتوحة
});

// التعامل مع الرسائل
async function handleMessage(request, sender, sendResponse) {
    try {
        switch (request.type) {
            case 'GET_SETTINGS':
                const settings = await getSettings();
                sendResponse({ success: true, data: settings });
                break;
                
            case 'SAVE_SETTINGS':
                await saveSettings(request.settings);
                sendResponse({ success: true });
                break;
                
            case 'LOG_COMMAND':
                await logCommand(request.command, request.result);
                sendResponse({ success: true });
                break;
                
            case 'GET_COMMAND_HISTORY':
                const history = await getCommandHistory();
                sendResponse({ success: true, data: history });
                break;
                
            case 'CLEAR_HISTORY':
                await clearCommandHistory();
                sendResponse({ success: true });
                break;
                
            case 'EXECUTE_GLOBAL_COMMAND':
                await executeGlobalCommand(request.command);
                sendResponse({ success: true });
                break;
                
            default:
                sendResponse({ success: false, error: 'نوع رسالة غير معروف' });
        }
    } catch (error) {
        console.error('خطأ في service worker:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// الحصول على الإعدادات
async function getSettings() {
    const result = await chrome.storage.local.get(['agentSettings']);
    return result.agentSettings || {
        language: 'ar',
        autoComplete: true,
        notifications: true,
        commandHistory: []
    };
}

// حفظ الإعدادات
async function saveSettings(settings) {
    await chrome.storage.local.set({ agentSettings: settings });
}

// تسجيل الأوامر
async function logCommand(command, result) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        command,
        result,
        timestamp,
        success: result.success || false
    };
    
    const result_data = await chrome.storage.local.get(['commandLogs']);
    let logs = result_data.commandLogs || [];
    
    logs.unshift(logEntry);
    
    // الاحتفاظ بآخر 100 سجل فقط
    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }
    
    await chrome.storage.local.set({ commandLogs: logs });
}

// الحصول على تاريخ الأوامر
async function getCommandHistory() {
    const result = await chrome.storage.local.get(['commandHistory']);
    return result.commandHistory || [];
}

// مسح تاريخ الأوامر
async function clearCommandHistory() {
    await chrome.storage.local.set({ commandHistory: [] });
    await chrome.storage.local.set({ commandLogs: [] });
}

// تنفيذ أوامر عامة (مثل فتح تبويبات جديدة)
async function executeGlobalCommand(command) {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (trimmedCommand.includes('افتح تبويب جديد') || trimmedCommand.includes('تبويب جديد')) {
        const url = extractUrl(command) || 'chrome://newtab/';
        await chrome.tabs.create({ url });
        return 'تم فتح تبويب جديد';
    }
    
    if (trimmedCommand.includes('أغلق التبويب') || trimmedCommand.includes('اغلاق التبويب')) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.remove(tab.id);
        return 'تم إغلاق التبويب';
    }
    
    if (trimmedCommand.includes('تحديث الصفحة') || trimmedCommand.includes('اعادة تحميل')) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.reload(tab.id);
        return 'تم تحديث الصفحة';
    }
    
    throw new Error('أمر عام غير مدعوم');
}

// استخراج الرابط من النص
function extractUrl(text) {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) return urlMatch[1];
    
    const domainMatch = text.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    if (domainMatch) return 'https://' + domainMatch[1];
    
    return null;
}

// مراقبة تحديث التبويبات
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // تحديث آخر موقع تم زيارته
        chrome.storage.local.set({ lastVisitedUrl: tab.url });
    }
});

// مراقبة النوافذ النشطة
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    chrome.storage.local.set({ activeTabUrl: tab.url });
});

// التعامل مع اختصارات لوحة المفاتيح
chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case 'open-agent':
            chrome.action.openPopup();
            break;
            
        case 'quick-search':
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'FOCUS_SEARCH'
                });
            });
            break;
    }
});

// تحديث بيانات الاستخدام
chrome.storage.local.get(['usageStats'], (result) => {
    let stats = result.usageStats || {
        commandsExecuted: 0,
        installDate: new Date().toISOString(),
        lastUsed: null
    };
    
    stats.lastUsed = new Date().toISOString();
    chrome.storage.local.set({ usageStats: stats });
});

// معالجة الأخطاء العامة
chrome.runtime.onSuspend.addListener(() => {
    console.log('🔄 وكيل خالد في وضع السكون');
});

// رسائل تشخيصية
console.log('🤖 Service Worker لوكيل خالد الذكي جاهز للعمل!');