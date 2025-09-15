// Content Script for Khalid Agent
// وكيل خالد الذكي - سكريبت المحتوى

// متغيرات عامة
let isExecuting = false;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// استمع للرسائل من popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXECUTE_COMMAND') {
        executeCommand(request.command)
            .then(result => sendResponse({ success: true, result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // يحافظ على قناة الاتصال مفتوحة للرد غير المتزامن
    }
});

// تنفيذ الأمر الرئيسي
async function executeCommand(command) {
    if (isExecuting) {
        throw new Error('يتم تنفيذ أمر آخر حالياً، يرجى الانتظار');
    }

    isExecuting = true;
    showNotification('جارٍ تنفيذ الأمر...', 'info');

    try {
        const result = await parseAndExecuteCommand(command);
        showNotification('تم تنفيذ الأمر بنجاح!', 'success');
        return result;
    } catch (error) {
        showNotification(`خطأ: ${error.message}`, 'error');
        throw error;
    } finally {
        isExecuting = false;
    }
}

// تحليل وتنفيذ الأمر
async function parseAndExecuteCommand(command) {
    const trimmedCommand = command.trim().toLowerCase();

    // أوامر التنقل
    if (trimmedCommand.includes('اذهب إلى') || trimmedCommand.includes('انتقل إلى')) {
        return await handleNavigationCommand(command);
    }

    // أوامر الكتابة
    if (trimmedCommand.includes('اكتب في') || trimmedCommand.includes('اكتب')) {
        return await handleTypeCommand(command);
    }

    // أوامر النقر
    if (trimmedCommand.includes('اضغط على') || trimmedCommand.includes('انقر على')) {
        return await handleClickCommand(command);
    }

    // أوامر البحث
    if (trimmedCommand.includes('ابحث عن') || trimmedCommand.includes('بحث')) {
        return await handleSearchCommand(command);
    }

    // أوامر التمرير
    if (trimmedCommand.includes('مرر إلى') || trimmedCommand.includes('اذهب إلى')) {
        return await handleScrollCommand(command);
    }

    // أوامر فتح الروابط
    if (trimmedCommand.includes('افتح الرابط') || trimmedCommand.includes('افتح')) {
        return await handleOpenLinkCommand(command);
    }

    // أوامر الانتظار
    if (trimmedCommand.includes('انتظر') || trimmedCommand.includes('wait')) {
        return await handleWaitCommand(command);
    }

    throw new Error('الأمر غير مفهوم. جرب أوامر مثل: "اذهب إلى google.com" أو "اكتب في البحث: نص"');
}

// التعامل مع أوامر التنقل
async function handleNavigationCommand(command) {
    const urlMatch = command.match(/(?:اذهب إلى|انتقل إلى)\s+(.+)/);
    if (!urlMatch) {
        throw new Error('لم يتم العثور على رابط في الأمر');
    }

    let url = urlMatch[1].trim();
    
    // إضافة بروتوكول إذا لم يكن موجوداً
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    window.location.href = url;
    return `تم الانتقال إلى: ${url}`;
}

// التعامل مع أوامر الكتابة
async function handleTypeCommand(command) {
    let targetText, inputText;
    
    // تحليل الأمر للحصول على المكان والنص
    const typeMatch = command.match(/اكتب في\s+(.+?):\s*(.+)/);
    if (typeMatch) {
        targetText = typeMatch[1].trim();
        inputText = typeMatch[2].trim();
    } else {
        const simpleTypeMatch = command.match(/اكتب\s+(.+)/);
        if (simpleTypeMatch) {
            inputText = simpleTypeMatch[1].trim();
            targetText = 'البحث'; // افتراضي
        } else {
            throw new Error('تنسيق الأمر غير صحيح. استخدم: "اكتب في البحث: النص"');
        }
    }

    // البحث عن العنصر المناسب
    const element = findInputElement(targetText);
    if (!element) {
        throw new Error(`لم يتم العثور على حقل "${targetText}"`);
    }

    // التركيز على العنصر وكتابة النص
    element.focus();
    await delay(500);
    
    // مسح المحتوى السابق وكتابة النص الجديد
    element.value = '';
    await simulateTyping(element, inputText);

    return `تم كتابة "${inputText}" في "${targetText}"`;
}

// التعامل مع أوامر النقر
async function handleClickCommand(command) {
    const clickMatch = command.match(/(?:اضغط على|انقر على)\s+(.+)/);
    if (!clickMatch) {
        throw new Error('لم يتم تحديد العنصر للنقر عليه');
    }

    const targetText = clickMatch[1].trim();
    const element = findClickableElement(targetText);
    
    if (!element) {
        throw new Error(`لم يتم العثور على العنصر "${targetText}"`);
    }

    // تمرير إلى العنصر إذا لزم الأمر
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(500);

    // النقر على العنصر
    element.click();
    await delay(300);

    return `تم النقر على "${targetText}"`;
}

// البحث عن حقول الإدخال
function findInputElement(targetText) {
    const selectors = [
        'input[type="text"]',
        'input[type="search"]',
        'input[name*="search"]',
        'input[placeholder*="بحث"]',
        'input[placeholder*="search"]',
        'textarea',
        'input[type="email"]',
        'input[type="password"]'
    ];

    // البحث بالنص المحدد
    if (targetText.includes('بحث') || targetText.includes('search')) {
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.placeholder && 
                    (el.placeholder.includes('بحث') || el.placeholder.includes('search'))) {
                    return el;
                }
                if (el.name && 
                    (el.name.includes('search') || el.name.includes('q'))) {
                    return el;
                }
            }
        }
    }

    // البحث العام
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) { // العنصر مرئي
            return element;
        }
    }

    return null;
}

// البحث عن العناصر القابلة للنقر
function findClickableElement(targetText) {
    const searchTerms = targetText.toLowerCase();
    
    // أزرار البحث المحددة
    if (searchTerms.includes('بحث') || searchTerms.includes('search')) {
        const searchButtons = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("بحث")',
            'button:contains("Search")',
            '[value*="بحث"]',
            '[value*="Search"]'
        ];
        
        for (const selector of searchButtons) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
    }

    // البحث بالنص الفعلي
    const allClickable = document.querySelectorAll('button, a, input[type="submit"], input[type="button"], [role="button"]');
    
    for (const el of allClickable) {
        const text = (el.textContent || el.value || el.title || '').toLowerCase();
        if (text.includes(searchTerms)) {
            return el;
        }
    }

    // البحث في الروابط
    if (searchTerms.includes('رابط') || searchTerms.includes('الأول')) {
        const links = document.querySelectorAll('a[href]');
        if (links.length > 0) {
            return searchTerms.includes('الأول') ? links[0] : links[0];
        }
    }

    return null;
}

// محاكاة الكتابة الطبيعية
async function simulateTyping(element, text) {
    for (let i = 0; i < text.length; i++) {
        element.value += text[i];
        
        // إطلاق أحداث الكتابة
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('keydown', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        
        await delay(50 + Math.random() * 50); // تأخير عشوائي طبيعي
    }
    
    // إطلاق حدث التغيير النهائي
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    // إزالة الإشعار السابق إن وجد
    const existingNotification = document.querySelector('#khalid-agent-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // إنشاء إشعار جديد
    const notification = document.createElement('div');
    notification.id = 'khalid-agent-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        direction: rtl;
        text-align: right;
        transition: opacity 0.3s;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// أوامر إضافية
async function handleSearchCommand(command) {
    const searchMatch = command.match(/(?:ابحث عن|بحث)\s+(.+)/);
    if (!searchMatch) {
        throw new Error('لم يتم تحديد نص البحث');
    }

    const searchText = searchMatch[1].trim();
    
    // محاولة العثور على حقل البحث وكتابة النص
    await handleTypeCommand(`اكتب في البحث: ${searchText}`);
    await delay(1000);
    
    // الضغط على زر البحث
    await handleClickCommand('اضغط على بحث');
    
    return `تم البحث عن: ${searchText}`;
}

async function handleScrollCommand(command) {
    if (command.includes('أعلى')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (command.includes('أسفل')) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
    return 'تم التمرير';
}

async function handleOpenLinkCommand(command) {
    if (command.includes('الأول')) {
        const firstLink = document.querySelector('a[href]');
        if (firstLink) {
            firstLink.click();
            return 'تم فتح الرابط الأول';
        }
    }
    throw new Error('لم يتم العثور على رابط');
}

async function handleWaitCommand(command) {
    const waitMatch = command.match(/انتظر\s+(\d+)/);
    const seconds = waitMatch ? parseInt(waitMatch[1]) : 2;
    await delay(seconds * 1000);
    return `تم الانتظار ${seconds} ثانية`;
}

// تسجيل تحميل السكريبت
console.log('🤖 تم تحميل وكيل خالد الذكي بنجاح!');