// Popup script for Khalid Web Agent
document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('commandInput');
    const executeBtn = document.getElementById('executeBtn');
    const examplesBtn = document.getElementById('examplesBtn');
    const examples = document.getElementById('examples');
    const status = document.getElementById('status');
    
    // Load saved command from storage
    chrome.storage.local.get(['lastCommand'], function(result) {
        if (result.lastCommand) {
            commandInput.value = result.lastCommand;
        }
    });
    
    // Toggle examples visibility
    examplesBtn.addEventListener('click', function() {
        examples.classList.toggle('hidden');
        examplesBtn.textContent = examples.classList.contains('hidden') ? '💡 أمثلة' : '🔙 إخفاء';
    });
    
    // Handle example clicks
    examples.addEventListener('click', function(e) {
        if (e.target.classList.contains('example-item')) {
            const command = e.target.getAttribute('data-command');
            commandInput.value = command;
            examples.classList.add('hidden');
            examplesBtn.textContent = '💡 أمثلة';
        }
    });
    
    // Execute command
    executeBtn.addEventListener('click', async function() {
        const command = commandInput.value.trim();
        
        if (!command) {
            showStatus('الرجاء إدخال أمر', 'error');
            return;
        }
        
        // Save command to storage
        chrome.storage.local.set({lastCommand: command});
        
        try {
            // Get active tab
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            if (!tab) {
                showStatus('لا يمكن العثور على التبويب النشط', 'error');
                return;
            }
            
            // Show processing status
            showStatus('جاري تنفيذ الأمر...', 'success');
            executeBtn.disabled = true;
            executeBtn.textContent = 'جاري التنفيذ...';
            
            // Send command to content script
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'executeCommand',
                command: command
            });
            
            if (response && response.success) {
                showStatus('تم تنفيذ الأمر بنجاح ✅', 'success');
            } else {
                showStatus(response?.error || 'حدث خطأ في تنفيذ الأمر', 'error');
            }
            
        } catch (error) {
            console.error('Error executing command:', error);
            showStatus('خطأ في الاتصال مع الصفحة', 'error');
        } finally {
            executeBtn.disabled = false;
            executeBtn.textContent = 'تنفيذ الأمر ⚡';
        }
    });
    
    // Handle Enter key in textarea
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            executeBtn.click();
        }
    });
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');
        
        // Auto hide after 3 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                status.classList.add('hidden');
            }, 3000);
        }
    }
});