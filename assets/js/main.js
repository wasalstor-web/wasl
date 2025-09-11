// JavaScript لمنصة وســـل

document.addEventListener('DOMContentLoaded', function() {
    console.log('مرحباً بك في منصة وســـل!');
    
    // إضافة تأثير عند التحميل
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);
    
    // إضافة معلومات الموقع
    const siteInfo = {
        name: 'وســـل',
        version: '1.0.0',
        description: 'منصة للخدمات اللوجستية',
        lastUpdated: new Date().toLocaleDateString('ar-SA')
    };
    
    // عرض معلومات الموقع في الكونسول
    console.table(siteInfo);
    
    // إضافة تفاعل بسيط
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // إضافة معلومات المتصفح
    const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
    };
    
    console.log('معلومات المتصفح:', browserInfo);
});