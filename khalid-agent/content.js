// content.js - Khalid Web Agent Content Script

class KhalidAgent {
    constructor() {
        this.isProcessing = false;
        this.init();
    }
    
    init() {
        console.log('🤖 Khalid Web Agent initialized on:', window.location.href);
        this.setupMessageListener();
    }
    
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'EXECUTE_COMMAND') {
                this.executeCommand(message.command, message.settings)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true; // Keep message channel open for async response
            }
        });
    }
    
    async executeCommand(command, settings = {}) {
        if (this.isProcessing) {
            throw new Error('يتم تنفيذ أمر آخر حالياً، انتظر قليلاً');
        }
        
        this.isProcessing = true;
        
        try {
            console.log('🎯 Executing command:', command);
            
            // Parse and execute the command
            const result = await this.parseAndExecute(command);
            
            if (settings.showNotifications) {
                this.showNotification('تم تنفيذ الأمر بنجاح', 'success');
            }
            
            return { success: true, result };
            
        } catch (error) {
            console.error('❌ Command execution failed:', error);
            
            if (settings.showNotifications) {
                this.showNotification(`فشل في التنفيذ: ${error.message}`, 'error');
            }
            
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }
    
    async parseAndExecute(command) {
        const normalizedCommand = command.trim().toLowerCase();
        
        // Navigation commands
        if (this.isNavigationCommand(normalizedCommand)) {
            return await this.handleNavigation(command);
        }
        
        // Input/typing commands
        if (this.isInputCommand(normalizedCommand)) {
            return await this.handleInput(command);
        }
        
        // Click commands
        if (this.isClickCommand(normalizedCommand)) {
            return await this.handleClick(command);
        }
        
        // Search commands
        if (this.isSearchCommand(normalizedCommand)) {
            return await this.handleSearch(command);
        }
        
        // Scroll commands
        if (this.isScrollCommand(normalizedCommand)) {
            return await this.handleScroll(command);
        }
        
        throw new Error('لم أتمكن من فهم الأمر. جرب أمراً مختلفاً.');
    }
    
    // Command type detection methods
    isNavigationCommand(command) {
        const navKeywords = ['اذهب', 'انتقل', 'افتح', 'زر', 'visit', 'go', 'navigate'];
        return navKeywords.some(keyword => command.includes(keyword));
    }
    
    isInputCommand(command) {
        const inputKeywords = ['اكتب', 'أدخل', 'املأ', 'type', 'write', 'fill'];
        return inputKeywords.some(keyword => command.includes(keyword));
    }
    
    isClickCommand(command) {
        const clickKeywords = ['اضغط', 'انقر', 'click', 'press', 'اختر'];
        return clickKeywords.some(keyword => command.includes(keyword));
    }
    
    isSearchCommand(command) {
        const searchKeywords = ['ابحث', 'search', 'بحث'];
        return searchKeywords.some(keyword => command.includes(keyword));
    }
    
    isScrollCommand(command) {
        const scrollKeywords = ['اصعد', 'انزل', 'scroll', 'تمرير'];
        return scrollKeywords.some(keyword => command.includes(keyword));
    }
    
    // Command execution methods
    async handleNavigation(command) {
        // Extract URL from command
        const urlMatch = command.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        
        if (urlMatch) {
            let url = urlMatch[0];
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            
            window.location.href = url;
            return `الانتقال إلى: ${url}`;
        }
        
        throw new Error('لم أتمكن من العثور على رابط صحيح في الأمر');
    }
    
    async handleInput(command) {
        // Extract target and text
        const match = command.match(/اكتب\s+في\s+\(([^)]+)\):\s*(.+)/i) || 
                     command.match(/أدخل\s+في\s+\(([^)]+)\):\s*(.+)/i);
        
        if (match) {
            const target = match[1];
            const text = match[2];
            
            const element = this.findElementByText(target) || this.findInputElement(target);
            
            if (element) {
                element.focus();
                element.value = text;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                
                return `تم كتابة "${text}" في ${target}`;
            }
        }
        
        // Simple text input without target
        const textMatch = command.match(/اكتب:?\s*(.+)/i);
        if (textMatch) {
            const text = textMatch[1];
            const activeElement = document.activeElement;
            
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                activeElement.value = text;
                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                return `تم كتابة: ${text}`;
            }
        }
        
        throw new Error('لم أتمكن من العثور على حقل الإدخال المطلوب');
    }
    
    async handleClick(command) {
        // Extract button/element name
        const match = command.match(/اضغط\s+(?:على\s+)?(?:زر\s+)?(.+)/i) ||
                     command.match(/انقر\s+(?:على\s+)?(.+)/i);
        
        if (match) {
            const target = match[1].trim();
            
            const element = this.findElementByText(target) || 
                           this.findButtonByText(target) ||
                           this.findLinkByText(target);
            
            if (element) {
                element.click();
                return `تم الضغط على: ${target}`;
            }
        }
        
        throw new Error('لم أتمكن من العثور على العنصر المطلوب للضغط عليه');
    }
    
    async handleSearch(command) {
        const match = command.match(/ابحث\s+(?:عن\s+)?(.+)/i);
        if (match) {
            const searchText = match[1];
            
            // Try to find search input
            const searchInput = document.querySelector('input[type="search"]') ||
                              document.querySelector('input[name*="search"]') ||
                              document.querySelector('input[placeholder*="بحث"]') ||
                              document.querySelector('input[placeholder*="search"]') ||
                              document.querySelector('.search input') ||
                              document.querySelector('#search input');
            
            if (searchInput) {
                searchInput.focus();
                searchInput.value = searchText;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Try to find and click search button
                const searchButton = document.querySelector('button[type="submit"]') ||
                                   document.querySelector('input[type="submit"]') ||
                                   this.findButtonByText('بحث') ||
                                   this.findButtonByText('search');
                
                if (searchButton) {
                    setTimeout(() => searchButton.click(), 100);
                }
                
                return `تم البحث عن: ${searchText}`;
            }
        }
        
        throw new Error('لم أتمكن من العثور على حقل البحث');
    }
    
    async handleScroll(command) {
        if (command.includes('اصعد') || command.includes('scroll up')) {
            window.scrollBy(0, -300);
            return 'تم التمرير للأعلى';
        } else if (command.includes('انزل') || command.includes('scroll down')) {
            window.scrollBy(0, 300);
            return 'تم التمرير للأسفل';
        }
        
        throw new Error('أمر التمرير غير مفهوم');
    }
    
    // Helper methods for finding elements
    findElementByText(text) {
        const xpath = `//*[contains(text(), "${text}")]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }
    
    findButtonByText(text) {
        const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
        for (const button of buttons) {
            if (button.textContent.includes(text) || 
                button.value.includes(text) ||
                button.getAttribute('aria-label')?.includes(text)) {
                return button;
            }
        }
        return null;
    }
    
    findLinkByText(text) {
        const links = document.querySelectorAll('a');
        for (const link of links) {
            if (link.textContent.includes(text)) {
                return link;
            }
        }
        return null;
    }
    
    findInputElement(label) {
        // Try to find input by placeholder, label, or name
        const inputs = document.querySelectorAll('input, textarea, select');
        for (const input of inputs) {
            if (input.placeholder?.includes(label) ||
                input.name?.includes(label) ||
                input.id?.includes(label)) {
                return input;
            }
        }
        
        // Try to find by associated label
        const labels = document.querySelectorAll('label');
        for (const labelEl of labels) {
            if (labelEl.textContent.includes(label)) {
                const forAttr = labelEl.getAttribute('for');
                if (forAttr) {
                    return document.getElementById(forAttr);
                }
                // Look for input inside label
                const input = labelEl.querySelector('input, textarea, select');
                if (input) return input;
            }
        }
        
        return null;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            direction: rtl;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the agent
const khalidAgent = new KhalidAgent();