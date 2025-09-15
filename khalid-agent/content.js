// Khalid Agent - Enhanced with Google AI Integration
// وكيل خالد المطور مع دمج الذكاء الاصطناعي من جوجل

class KhalidAgent {
    constructor() {
        this.isActive = false;
        this.commands = [];
        this.init();
    }

    init() {
        this.injectStyles();
        this.listenForCommands();
        this.addGoogleAIFeatures();
        console.log('وكيل خالد جاهز مع تقنيات جوجل المتطورة! 🤖');
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .khalid-highlight {
                background: linear-gradient(135deg, #4285f4, #34a853) !important;
                color: white !important;
                padding: 2px 4px !important;
                border-radius: 3px !important;
                animation: khalidPulse 1s infinite;
            }
            
            @keyframes khalidPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .khalid-tooltip {
                position: fixed;
                background: #4285f4;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                direction: rtl;
            }
            
            .khalid-ai-response {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                border-radius: 8px;
                max-width: 300px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                direction: rtl;
                font-family: 'Segoe UI', Tahoma, sans-serif;
            }
        `;
        document.head.appendChild(style);
    }

    addGoogleAIFeatures() {
        // Enhanced command understanding using Google-like AI patterns
        this.aiCommands = {
            // Navigation commands
            'اذهب إلى': (url) => this.navigateToSite(url),
            'افتح موقع': (url) => this.navigateToSite(url),
            'visit': (url) => this.navigateToSite(url),
            
            // Search commands with AI enhancement
            'ابحث عن': (query) => this.smartSearch(query),
            'find': (query) => this.smartSearch(query),
            'search for': (query) => this.smartSearch(query),
            
            // Form filling with AI assistance
            'املأ': (text) => this.intelligentFill(text),
            'اكتب': (text) => this.intelligentFill(text),
            'fill': (text) => this.intelligentFill(text),
            
            // Click commands with smart targeting
            'اضغط': (target) => this.smartClick(target),
            'انقر': (target) => this.smartClick(target),
            'click': (target) => this.smartClick(target),
            
            // AI-powered page analysis
            'حلل الصفحة': () => this.analyzePageWithAI(),
            'لخص المحتوى': () => this.summarizeContent(),
            'اقترح إجراءات': () => this.suggestActions()
        };
    }

    listenForCommands() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'executeCommand') {
                this.executeCommand(request.command);
                sendResponse({success: true});
            }
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                this.showAIAssistant();
            }
        });
    }

    executeCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Try to match AI commands
        for (const [trigger, action] of Object.entries(this.aiCommands)) {
            if (lowerCommand.includes(trigger.toLowerCase())) {
                const parameter = lowerCommand.replace(trigger.toLowerCase(), '').trim();
                action(parameter);
                return;
            }
        }

        // Enhanced Google-specific commands
        if (lowerCommand.includes('google') || lowerCommand.includes('جوجل')) {
            this.handleGoogleCommands(command);
            return;
        }

        // Fallback to general command processing
        this.processGeneralCommand(command);
    }

    handleGoogleCommands(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('maps') || lowerCommand.includes('خرائط')) {
            this.openGoogleMaps();
        } else if (lowerCommand.includes('translate') || lowerCommand.includes('ترجم')) {
            this.activateGoogleTranslate();
        } else if (lowerCommand.includes('search') || lowerCommand.includes('بحث')) {
            const query = command.split(/search|بحث/i)[1]?.trim();
            if (query) {
                this.googleSearch(query);
            }
        }
    }

    navigateToSite(url) {
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        window.location.href = url;
        this.showAIResponse(`تم الانتقال إلى ${url} 🌐`);
    }

    smartSearch(query) {
        // Enhanced search that understands context
        const searchEngines = {
            'google': 'https://www.google.com/search?q=',
            'maps': 'https://www.google.com/maps/search/',
            'images': 'https://www.google.com/search?tbm=isch&q='
        };

        let engine = 'google';
        if (query.includes('خريطة') || query.includes('موقع')) {
            engine = 'maps';
        } else if (query.includes('صورة') || query.includes('صور')) {
            engine = 'images';
        }

        window.open(searchEngines[engine] + encodeURIComponent(query), '_blank');
        this.showAIResponse(`تم البحث عن "${query}" في ${engine} 🔍`);
    }

    intelligentFill(text) {
        // AI-enhanced form filling
        const activeElement = document.activeElement;
        
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            activeElement.value = text;
            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            this.highlightElement(activeElement);
            this.showAIResponse(`تم إدخال النص: "${text}" ✍️`);
        } else {
            // Smart field detection
            const possibleFields = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
            if (possibleFields.length > 0) {
                const field = possibleFields[0];
                field.focus();
                field.value = text;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                this.highlightElement(field);
                this.showAIResponse(`تم إدخال النص في أول حقل متاح ✍️`);
            }
        }
    }

    smartClick(target) {
        // AI-powered element targeting
        let element = null;
        
        // Try different search strategies
        const searchStrategies = [
            () => document.querySelector(`[aria-label*="${target}"]`),
            () => document.querySelector(`[title*="${target}"]`),
            () => document.querySelector(`button:contains("${target}")`),
            () => Array.from(document.querySelectorAll('button, a, input[type="submit"]')).find(el => 
                el.textContent.includes(target) || el.value?.includes(target)
            ),
            () => Array.from(document.querySelectorAll('*')).find(el => 
                el.textContent.trim() === target
            )
        ];

        for (const strategy of searchStrategies) {
            element = strategy();
            if (element) break;
        }

        if (element) {
            this.highlightElement(element);
            setTimeout(() => {
                element.click();
                this.showAIResponse(`تم النقر على "${target}" ✅`);
            }, 500);
        } else {
            this.showAIResponse(`لم يتم العثور على العنصر "${target}" ❌`);
        }
    }

    analyzePageWithAI() {
        const analysis = {
            title: document.title,
            forms: document.forms.length,
            links: document.links.length,
            images: document.images.length,
            buttons: document.querySelectorAll('button').length,
            inputs: document.querySelectorAll('input').length
        };

        const report = `
تحليل الصفحة بالذكاء الاصطناعي:
📄 العنوان: ${analysis.title}
📝 النماذج: ${analysis.forms}
🔗 الروابط: ${analysis.links}
🖼️ الصور: ${analysis.images}
🔘 الأزرار: ${analysis.buttons}
📋 حقول الإدخال: ${analysis.inputs}
        `;

        this.showAIResponse(report);
    }

    summarizeContent() {
        // Simple content summarization
        const paragraphs = Array.from(document.querySelectorAll('p, h1, h2, h3'))
            .map(el => el.textContent.trim())
            .filter(text => text.length > 20)
            .slice(0, 3);

        const summary = paragraphs.length > 0 
            ? `ملخص المحتوى:\n${paragraphs.join('\n\n')}`
            : 'لا يمكن إنشاء ملخص للمحتوى الحالي';

        this.showAIResponse(summary);
    }

    suggestActions() {
        const suggestions = [];
        
        if (document.forms.length > 0) {
            suggestions.push('🔍 يمكنني مساعدتك في ملء النماذج');
        }
        
        if (document.querySelectorAll('button').length > 0) {
            suggestions.push('👆 يمكنني النقر على الأزرار نيابة عنك');
        }
        
        if (document.links.length > 0) {
            suggestions.push('🌐 يمكنني الانتقال إلى الروابط');
        }

        if (window.location.href.includes('google.com')) {
            suggestions.push('🤖 استخدم أوامر جوجل المتخصصة');
        }

        const response = suggestions.length > 0 
            ? `الإجراءات المقترحة:\n${suggestions.join('\n')}`
            : 'استخدم الأوامر الصوتية أو اكتب أوامر مثل "اذهب إلى wasl.store"';

        this.showAIResponse(response);
    }

    openGoogleMaps() {
        window.open('https://maps.google.com', '_blank');
        this.showAIResponse('تم فتح خرائط جوجل 🗺️');
    }

    activateGoogleTranslate() {
        // Try to activate Google Translate widget if present
        const translateWidget = document.querySelector('#google_translate_element');
        if (translateWidget) {
            translateWidget.click();
            this.showAIResponse('تم تفعيل مترجم جوجل 🌍');
        } else {
            window.open(`https://translate.google.com/?sl=auto&tl=ar&text=${encodeURIComponent(window.getSelection().toString() || document.title)}`, '_blank');
            this.showAIResponse('تم فتح مترجم جوجل 🌍');
        }
    }

    googleSearch(query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        this.showAIResponse(`تم البحث في جوجل عن: "${query}" 🔍`);
    }

    highlightElement(element) {
        element.classList.add('khalid-highlight');
        setTimeout(() => {
            element.classList.remove('khalid-highlight');
        }, 2000);
    }

    showAIResponse(message) {
        // Remove existing response
        const existing = document.querySelector('.khalid-ai-response');
        if (existing) {
            existing.remove();
        }

        // Create new response
        const response = document.createElement('div');
        response.className = 'khalid-ai-response';
        response.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">🤖 وكيل خالد الذكي</div>
            <div style="white-space: pre-line;">${message}</div>
        `;

        document.body.appendChild(response);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (response.parentNode) {
                response.remove();
            }
        }, 5000);
    }

    showAIAssistant() {
        const assistant = document.createElement('div');
        assistant.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border-radius: 12px; 
                        box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 10001; direction: rtl;
                        min-width: 300px;">
                <h3 style="margin: 0 0 15px 0; color: #4285f4;">🤖 مساعد خالد الذكي</h3>
                <input type="text" id="khalidCommand" placeholder="اكتب أمرك هنا..." 
                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="padding: 8px 16px; background: #f1f3f4; border: none; border-radius: 6px; cursor: pointer;">إلغاء</button>
                    <button onclick="khalidAgent.executeCommand(document.getElementById('khalidCommand').value); this.parentElement.parentElement.parentElement.remove();" 
                            style="padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 6px; cursor: pointer;">تنفيذ</button>
                </div>
            </div>
        `;
        document.body.appendChild(assistant);
        document.getElementById('khalidCommand').focus();
    }

    processGeneralCommand(command) {
        // Fallback for commands not handled by AI
        this.showAIResponse(`تم استلام الأمر: "${command}"\nأعمل على تحسين فهمي لهذا النوع من الأوامر 🤖`);
    }
}

// Initialize Khalid Agent
const khalidAgent = new KhalidAgent();

// Export for global access
window.khalidAgent = khalidAgent;