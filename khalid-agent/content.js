// Content script for Khalid Web Agent
// This script runs on web pages and executes Arabic commands

class KhalidAgent {
    constructor() {
        this.isProcessing = false;
        this.init();
    }
    
    init() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'executeCommand') {
                this.executeCommand(request.command)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({success: false, error: error.message}));
                return true; // Will respond asynchronously
            }
        });
        
        console.log('وكيل خالد الذكي تم تحميله في الصفحة');
    }
    
    async executeCommand(command) {
        if (this.isProcessing) {
            throw new Error('يتم تنفيذ أمر آخر حالياً');
        }
        
        this.isProcessing = true;
        
        try {
            console.log('تنفيذ الأمر:', command);
            
            // Parse and execute command
            const result = await this.parseAndExecute(command);
            return {success: true, result};
            
        } catch (error) {
            console.error('خطأ في تنفيذ الأمر:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }
    
    async parseAndExecute(command) {
        const lowercaseCommand = command.toLowerCase();
        
        // Navigation commands
        if (lowercaseCommand.includes('اذهب إلى') || lowercaseCommand.includes('انتقل إلى')) {
            return await this.handleNavigation(command);
        }
        
        // Typing commands
        if (lowercaseCommand.includes('اكتب') || lowercaseCommand.includes('اكتب في')) {
            return await this.handleTyping(command);
        }
        
        // Click commands
        if (lowercaseCommand.includes('اضغط') || lowercaseCommand.includes('انقر')) {
            return await this.handleClick(command);
        }
        
        // Form filling commands
        if (lowercaseCommand.includes('املأ النموذج') || lowercaseCommand.includes('املأ الحقول')) {
            return await this.handleFormFilling(command);
        }
        
        // Wait commands
        if (lowercaseCommand.includes('انتظر')) {
            return await this.handleWait(command);
        }
        
        // Scroll commands
        if (lowercaseCommand.includes('مرر') || lowercaseCommand.includes('تمرير')) {
            return await this.handleScroll(command);
        }
        
        throw new Error('أمر غير مفهوم. جرب أمر مثل: "اذهب إلى google.com" أو "اكتب في البحث: خالد"');
    }
    
    async handleNavigation(command) {
        const urlMatch = command.match(/(?:اذهب إلى|انتقل إلى)\s+(.+)/i);
        if (!urlMatch) {
            throw new Error('لم يتم العثور على رابط في الأمر');
        }
        
        let url = urlMatch[1].trim();
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        window.location.href = url;
        return 'جاري الانتقال إلى: ' + url;
    }
    
    async handleTyping(command) {
        // Extract text to type
        const textMatch = command.match(/اكتب(?:\s+في\s+[^:]*)?:?\s*(.+)/i);
        if (!textMatch) {
            throw new Error('لم يتم العثور على النص المراد كتابته');
        }
        
        const textToType = textMatch[1].trim();
        
        // Find active input element or search for common input selectors
        let targetElement = document.activeElement;
        
        if (!targetElement || !this.isInputElement(targetElement)) {
            // Look for common search input selectors
            const searchSelectors = [
                'input[name="search"]',
                'input[name="q"]',
                'input[type="search"]',
                'input[placeholder*="بحث"]',
                'input[placeholder*="search"]',
                'textarea[placeholder*="اكتب"]',
                'input[class*="search"]',
                'input:not([type="hidden"]):not([type="submit"]):not([type="button"])'
            ];
            
            for (const selector of searchSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    targetElement = elements[0];
                    break;
                }
            }
        }
        
        if (!targetElement || !this.isInputElement(targetElement)) {
            throw new Error('لم يتم العثور على حقل إدخال للكتابة فيه');
        }
        
        // Focus and type
        targetElement.focus();
        targetElement.value = textToType;
        
        // Trigger input events
        targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        targetElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        return `تم كتابة: "${textToType}"`;
    }
    
    async handleClick(command) {
        let selector = '';
        
        if (command.includes('البحث') || command.includes('بحث Google')) {
            // Look for search button
            const searchSelectors = [
                'button[type="submit"]',
                'input[type="submit"]',
                'button[name="btnK"]',
                '[aria-label*="بحث"]',
                '[value*="بحث"]',
                'button:contains("بحث")',
                'button:contains("Search")'
            ];
            
            for (const sel of searchSelectors) {
                const elements = document.querySelectorAll(sel);
                if (elements.length > 0) {
                    elements[0].click();
                    return 'تم الضغط على زر البحث';
                }
            }
        }
        
        if (command.includes('الرابط الأول') || command.includes('النتيجة الأولى')) {
            // Look for first search result link
            const linkSelectors = [
                'h3 a',
                '.g a h3',
                '.result a',
                '.search-result a',
                'a[href*="://"]'
            ];
            
            for (const sel of linkSelectors) {
                const elements = document.querySelectorAll(sel);
                if (elements.length > 0 && elements[0].href) {
                    elements[0].click();
                    return 'تم الضغط على الرابط الأول';
                }
            }
        }
        
        // General button clicking based on text content
        const buttonText = this.extractTextFromCommand(command, ['اضغط على', 'انقر على']);
        if (buttonText) {
            const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"], [role="button"]'));
            const targetButton = buttons.find(btn => 
                btn.textContent.includes(buttonText) || 
                btn.value?.includes(buttonText) ||
                btn.getAttribute('aria-label')?.includes(buttonText)
            );
            
            if (targetButton) {
                targetButton.click();
                return `تم الضغط على: ${buttonText}`;
            }
        }
        
        throw new Error('لم يتم العثور على العنصر المراد الضغط عليه');
    }
    
    async handleFormFilling(command) {
        // Extract field-value pairs from command
        const pairs = this.extractFormData(command);
        let filledCount = 0;
        
        for (const [fieldName, value] of pairs) {
            const input = this.findInputByName(fieldName);
            if (input) {
                input.focus();
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                filledCount++;
            }
        }
        
        if (filledCount === 0) {
            throw new Error('لم يتم العثور على حقول مناسبة للملء');
        }
        
        return `تم ملء ${filledCount} حقل`;
    }
    
    async handleWait(command) {
        const timeMatch = command.match(/انتظر\s+(\d+)\s*(ثانية|دقيقة)?/i);
        if (!timeMatch) {
            throw new Error('تحديد وقت الانتظار غير واضح');
        }
        
        let seconds = parseInt(timeMatch[1]);
        if (timeMatch[2] === 'دقيقة') {
            seconds *= 60;
        }
        
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        return `تم الانتظار ${seconds} ثانية`;
    }
    
    async handleScroll(command) {
        if (command.includes('أعلى')) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            return 'تم التمرير إلى أعلى الصفحة';
        }
        
        if (command.includes('أسفل')) {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
            return 'تم التمرير إلى أسفل الصفحة';
        }
        
        // Scroll by amount
        const amountMatch = command.match(/مرر\s+(\d+)/i);
        if (amountMatch) {
            const amount = parseInt(amountMatch[1]);
            window.scrollBy({top: amount, behavior: 'smooth'});
            return `تم التمرير ${amount} بكسل`;
        }
        
        return 'تم التمرير';
    }
    
    // Helper methods
    isInputElement(element) {
        const inputTypes = ['input', 'textarea', 'select'];
        return inputTypes.includes(element.tagName.toLowerCase()) && 
               element.type !== 'submit' && 
               element.type !== 'button';
    }
    
    extractTextFromCommand(command, prefixes) {
        for (const prefix of prefixes) {
            const index = command.indexOf(prefix);
            if (index !== -1) {
                return command.substring(index + prefix.length).trim();
            }
        }
        return '';
    }
    
    extractFormData(command) {
        const pairs = [];
        // Simple pattern matching for "field: value" format
        const matches = command.match(/([^،:]+):\s*([^،]+)/g);
        
        if (matches) {
            matches.forEach(match => {
                const [field, value] = match.split(':').map(s => s.trim());
                pairs.push([field, value]);
            });
        }
        
        return pairs;
    }
    
    findInputByName(fieldName) {
        const fieldLower = fieldName.toLowerCase();
        
        // Common field mappings
        const fieldMappings = {
            'اسم': ['name', 'username', 'first_name', 'fname'],
            'إيميل': ['email', 'mail', 'e-mail'],
            'كلمة المرور': ['password', 'pass', 'pwd'],
            'هاتف': ['phone', 'tel', 'mobile'],
            'عنوان': ['address', 'addr']
        };
        
        // Try exact name match first
        let input = document.querySelector(`[name*="${fieldName}"]`);
        if (input) return input;
        
        // Try mapped names
        for (const [arabic, english] of Object.entries(fieldMappings)) {
            if (fieldLower.includes(arabic)) {
                for (const eng of english) {
                    input = document.querySelector(`[name*="${eng}"], [id*="${eng}"], [placeholder*="${eng}"]`);
                    if (input) return input;
                }
            }
        }
        
        return null;
    }
}

// Initialize the agent
new KhalidAgent();