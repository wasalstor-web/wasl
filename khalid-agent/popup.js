// popup.js - Khalid Web Agent Popup Script

class KhalidPopup {
    constructor() {
        this.commandInput = document.getElementById('commandInput');
        this.executeBtn = document.getElementById('executeBtn');
        this.examplesBtn = document.getElementById('examplesBtn');
        this.examplesList = document.getElementById('examplesList');
        this.status = document.getElementById('status');
        this.allowAllDomains = document.getElementById('allowAllDomains');
        this.showNotifications = document.getElementById('showNotifications');
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.bindEvents();
        this.showStatus('مرحباً! اكتب أمرك بالعربية', 'info');
    }
    
    bindEvents() {
        // Execute command button
        this.executeBtn.addEventListener('click', () => this.executeCommand());
        
        // Enter key in textarea
        this.commandInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.executeCommand();
            }
        });
        
        // Examples toggle
        this.examplesBtn.addEventListener('click', () => this.toggleExamples());
        
        // Example items click
        document.querySelectorAll('.example').forEach(example => {
            example.addEventListener('click', () => {
                const command = example.getAttribute('data-command');
                this.commandInput.value = command;
                this.hideExamples();
            });
        });
        
        // Settings
        this.allowAllDomains.addEventListener('change', () => this.saveSettings());
        this.showNotifications.addEventListener('change', () => this.saveSettings());
        
        // Focus on command input
        this.commandInput.focus();
    }
    
    async executeCommand() {
        const command = this.commandInput.value.trim();
        
        if (!command) {
            this.showStatus('الرجاء كتابة أمر أولاً', 'error');
            return;
        }
        
        this.showStatus('جاري تنفيذ الأمر...', 'info');
        this.executeBtn.disabled = true;
        this.executeBtn.textContent = 'جاري التنفيذ...';
        
        try {
            // Get current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('لا يمكن العثور على النافذة النشطة');
            }
            
            // Send command to content script
            const response = await chrome.tabs.sendMessage(tab.id, {
                type: 'EXECUTE_COMMAND',
                command: command,
                settings: {
                    allowAllDomains: this.allowAllDomains.checked,
                    showNotifications: this.showNotifications.checked
                }
            });
            
            if (response && response.success) {
                this.showStatus('تم تنفيذ الأمر بنجاح ✅', 'success');
                
                // Add to history
                this.addToHistory(command);
                
                // Clear input after successful execution
                setTimeout(() => {
                    this.commandInput.value = '';
                }, 1000);
            } else {
                throw new Error(response?.error || 'فشل في تنفيذ الأمر');
            }
            
        } catch (error) {
            console.error('Error executing command:', error);
            this.showStatus(`خطأ: ${error.message}`, 'error');
        } finally {
            this.executeBtn.disabled = false;
            this.executeBtn.textContent = 'تنفيذ الأمر';
        }
    }
    
    toggleExamples() {
        const isHidden = this.examplesList.classList.contains('hidden');
        
        if (isHidden) {
            this.examplesList.classList.remove('hidden');
            this.examplesBtn.textContent = '🔼 إخفاء الأمثلة';
        } else {
            this.hideExamples();
        }
    }
    
    hideExamples() {
        this.examplesList.classList.add('hidden');
        this.examplesBtn.textContent = '💡 أمثلة';
    }
    
    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        
        // Auto hide success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                this.status.textContent = '';
                this.status.className = 'status';
            }, 3000);
        }
    }
    
    async loadSettings() {
        try {
            const settings = await chrome.storage.sync.get({
                allowAllDomains: true,
                showNotifications: true
            });
            
            this.allowAllDomains.checked = settings.allowAllDomains;
            this.showNotifications.checked = settings.showNotifications;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    async saveSettings() {
        try {
            await chrome.storage.sync.set({
                allowAllDomains: this.allowAllDomains.checked,
                showNotifications: this.showNotifications.checked
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    async addToHistory(command) {
        try {
            const { commandHistory = [] } = await chrome.storage.local.get('commandHistory');
            
            // Add new command to beginning, limit to 10 items
            const updatedHistory = [command, ...commandHistory.filter(cmd => cmd !== command)].slice(0, 10);
            
            await chrome.storage.local.set({ commandHistory: updatedHistory });
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    }
}

// Handle extension errors
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTENSION_ERROR') {
        const popup = window.khalidPopup;
        if (popup) {
            popup.showStatus(`خطأ: ${message.error}`, 'error');
        }
    }
});

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.khalidPopup = new KhalidPopup();
});

// Handle extension installation/update
chrome.runtime.onInstalled.addListener(() => {
    console.log('Khalid Web Agent installed/updated');
});