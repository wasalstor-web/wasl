# Wasalstor Web

# Wasalstor Web

## شرح أساسي للمشروع
Wasalstor Web هو مشروع يهدف إلى تقديم منصة للنقل والتوصيل.

## الموقع المباشر
🌐 **الموقع متاح الآن على:** [wasl.store](https://wasl.store)

## إعداد النطاق المخصص (Custom Domain)

### المتطلبات
- نطاق مسجل (Domain) - في هذا المشروع: `wasl.store`
- إعدادات DNS صحيحة

### خطوات إعداد النطاق

#### 1. إعداد DNS
قم بإعداد السجلات التالية في إعدادات DNS لنطاقك:

```
Type: A
Name: @
Value: 185.199.108.153

Type: A  
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: wasalstor-web.github.io
```

#### 2. ملف CNAME
تم إنشاء ملف `CNAME` في الجذر يحتوي على:
```
wasl.store
```

#### 3. إعدادات GitHub Pages
في إعدادات المستودع:
1. انتقل إلى Settings > Pages
2. في قسم "Custom domain"، أدخل: `wasl.store`
3. فعّل "Enforce HTTPS"

### التحقق من الإعداد
- تأكد من أن النطاق يشير إلى GitHub Pages
- تحقق من شهادة SSL
- اختبر الوصول عبر `https://wasl.store`

## طريقة التشغيل المحلي
لتشغيل المشروع محلياً، يمكنك اتباع الخطوات التالية:

1. قم بتحميل المشروع:
   ```bash
   git clone https://github.com/wasalstor-web/wasl.git
   ```
2. انتقل إلى مجلد المشروع:
   ```bash
   cd wasl
   ```
3. افتح `index.html` في المتصفح

## المتطلبات
- متصفح ويب حديث
- (اختياري) خادم ويب محلي للتطوير

## معلومات مهمة
- للإبلاغ عن الأخطاء أو طلب ميزة جديدة، يرجى فتح Issue في الريبو.
- للمساهمة في المشروع، راجع دليل المساهمة CONTRIBUTING.md.