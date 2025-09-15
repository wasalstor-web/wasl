// Popup JavaScript for Khalid Agent
// وكيل خالد الذكي - JavaScript للواجهة المنبثقة

document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('commandInput');
    const executeBtn = document.getElementById('executeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const examplesBtn = document.getElementById('examplesBtn');
    const helpBtn = document.getElementById('helpBtn');
    const examples = document.getElementById('examples');
    const status = document.getElementById('status');

    // تنفيذ الأمر
    executeBtn.addEventListener('click', async function() {
        const command = commandInput.value.trim();
        if (!command) {
            showStatus('يرجى كتابة أمر للتنفيذ', 'error');
            return;
        }

        try {
            showStatus('جارٍ تنفيذ الأمر...', 'info');
            
            // الحصول على التبويب النشط
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // إرسال الأمر إلى content script
            await chrome.tabs.sendMessage(tab.id, {
                type: 'EXECUTE_COMMAND',
                command: command
            });

            showStatus('تم تنفيذ الأمر بنجاح!', 'success');
            
            // حفظ الأمر في التاريخ
            saveCommandToHistory(command);
            
        } catch (error) {
            console.error('خطأ في تنفيذ الأمر:', error);
            showStatus('حدث خطأ في تنفيذ الأمر', 'error');
        }
    });

    // مسح النص
    clearBtn.addEventListener('click', function() {
        commandInput.value = '';
        hideStatus();
        commandInput.focus();
    });

    // عرض/إخفاء الأمثلة
    examplesBtn.addEventListener('click', function() {
        if (examples.style.display === 'none') {
            examples.style.display = 'block';
            examplesBtn.textContent = '🔼 إخفاء الأمثلة';
        } else {
            examples.style.display = 'none';
            examplesBtn.textContent = '💡 أمثلة';
        }
    });

    // المساعدة
    helpBtn.addEventListener('click', function() {
        showHelp();
    });

    // النقر على الأمثلة
    examples.addEventListener('click', function(e) {
        if (e.target.classList.contains('example-item')) {
            const command = e.target.getAttribute('data-command');
            commandInput.value = command;
            commandInput.focus();
            hideStatus();
        }
    });

    // اختصارات لوحة المفاتيح
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            executeBtn.click();
        }
    });

    // إعطاء التركيز للحقل عند فتح الـ popup
    commandInput.focus();

    // تحميل آخر أمر من التاريخ
    loadLastCommand();
});

// عرض حالة العملية
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(hideStatus, 3000);
    }
}

// إخفاء الحالة
function hideStatus() {
    const status = document.getElementById('status');
    status.style.display = 'none';
}

// حفظ الأمر في التاريخ
async function saveCommandToHistory(command) {
    try {
        const result = await chrome.storage.local.get(['commandHistory']);
        let history = result.commandHistory || [];
        
        // إضافة الأمر الجديد في المقدمة
        history.unshift(command);
        
        // الاحتفاظ بآخر 20 أمر فقط
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        await chrome.storage.local.set({ commandHistory: history });
    } catch (error) {
        console.error('خطأ في حفظ الأمر:', error);
    }
}

// تحميل آخر أمر
async function loadLastCommand() {
    try {
        const result = await chrome.storage.local.get(['commandHistory']);
        const history = result.commandHistory || [];
        
        if (history.length > 0) {
            // يمكن إضافة آخر أمر كـ placeholder أو في dropdown
            // document.getElementById('commandInput').placeholder += ` (آخر أمر: ${history[0]})`;
        }
    } catch (error) {
        console.error('خطأ في تحميل التاريخ:', error);
    }
}

// عرض المساعدة
function showHelp() {
    const helpText = `
🤖 وكيل خالد الذكي - دليل الاستخدام

الأوامر المدعومة:
• "اذهب إلى [موقع]" - للانتقال لموقع
• "اكتب في [عنصر]: [نص]" - لكتابة النص
• "اضغط على [عنصر]" - للنقر على عنصر
• "ابحث عن [نص]" - للبحث في الصفحة

أمثلة:
• اذهب إلى google.com
• اكتب في البحث: وكيل ذكي
• اضغط على زر البحث
• افتح الرابط الأول

اختصارات:
• Ctrl+Enter: تنفيذ الأمر

نصائح:
• استخدم أوامر واضحة ومحددة
• تأكد من وجود العناصر في الصفحة
• جرب الأمثلة أولاً
    `;
    
    alert(helpText);
}