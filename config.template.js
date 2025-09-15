/**
 * Configuration Template for WASL Google Integration
 * قالب إعدادات دمج جوجل مع منصة وسل
 * 
 * Instructions:
 * 1. Copy this file to config.js
 * 2. Replace placeholder values with your actual API keys
 * 3. Update index.html to use this config file
 * 
 * تعليمات:
 * 1. انسخ هذا الملف إلى config.js
 * 2. استبدل القيم التجريبية بمفاتيح API الحقيقية
 * 3. حدث ملف index.html لاستخدام هذا الملف
 */

const WASL_CONFIG = {
    // Google Maps Configuration
    // إعدادات خرائط جوجل
    GOOGLE_MAPS: {
        API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
        DEFAULT_CENTER: { lat: 24.7136, lng: 46.6753 }, // Riyadh, Saudi Arabia
        DEFAULT_ZOOM: 10,
        LIBRARIES: ['places', 'geometry', 'directions']
    },

    // Google AI (Gemini) Configuration  
    // إعدادات الذكاء الاصطناعي من جوجل
    GOOGLE_AI: {
        API_KEY: 'YOUR_GOOGLE_AI_API_KEY_HERE',
        MODEL: 'gemini-pro',
        LANGUAGE: 'ar', // Arabic primary
        MAX_TOKENS: 1000
    },

    // Google OAuth Configuration
    // إعدادات مصادقة جوجل
    GOOGLE_OAUTH: {
        CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        SCOPES: ['profile', 'email'],
        HOSTED_DOMAIN: 'wasl.store'
    },

    // Google Analytics Configuration
    // إعدادات تحليلات جوجل
    GOOGLE_ANALYTICS: {
        MEASUREMENT_ID: 'G-XXXXXXXXXX',
        TRACK_PAGE_VIEWS: true,
        TRACK_EVENTS: true,
        DEBUG_MODE: false // Set to true for development
    },

    // Google Translate Configuration
    // إعدادات مترجم جوجل
    GOOGLE_TRANSLATE: {
        API_KEY: 'YOUR_GOOGLE_TRANSLATE_API_KEY_HERE',
        PAGE_LANGUAGE: 'ar',
        INCLUDED_LANGUAGES: ['ar', 'en', 'fr', 'es', 'tr', 'ur'],
        AUTO_DISPLAY: false
    },

    // Application Settings
    // إعدادات التطبيق
    APP: {
        NAME: 'منصة وسل الذكية',
        VERSION: '2.0',
        DOMAIN: 'wasl.store',
        SUPPORT_EMAIL: 'support@wasl.store',
        DEFAULT_LANGUAGE: 'ar',
        RTL_SUPPORT: true
    },

    // Feature Flags
    // علامات الميزات
    FEATURES: {
        AI_ASSISTANT: true,
        GOOGLE_MAPS: true,
        OAUTH_LOGIN: true,
        REAL_TIME_TRANSLATION: true,
        ANALYTICS_TRACKING: true,
        KHALID_AGENT: true
    },

    // Development Settings
    // إعدادات التطوير
    DEV: {
        DEBUG_MODE: false,
        CONSOLE_LOGS: false,
        API_MOCK: false, // Use mock responses for testing
        RATE_LIMIT: 100 // Requests per minute
    }
};

// Export for use in other files
// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WASL_CONFIG;
}

// Make available globally
// جعله متاحاً عالمياً
if (typeof window !== 'undefined') {
    window.WASL_CONFIG = WASL_CONFIG;
}

/**
 * Usage Examples / أمثلة الاستخدام:
 * 
 * // Initialize Google Maps
 * const map = new google.maps.Map(document.getElementById('map'), {
 *     center: WASL_CONFIG.GOOGLE_MAPS.DEFAULT_CENTER,
 *     zoom: WASL_CONFIG.GOOGLE_MAPS.DEFAULT_ZOOM
 * });
 * 
 * // Google Analytics Event
 * gtag('config', WASL_CONFIG.GOOGLE_ANALYTICS.MEASUREMENT_ID);
 * 
 * // OAuth Setup
 * google.accounts.id.initialize({
 *     client_id: WASL_CONFIG.GOOGLE_OAUTH.CLIENT_ID,
 *     callback: handleCredentialResponse
 * });
 */