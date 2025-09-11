# دليل إعداد النطاق المخصص
# Custom Domain Setup Guide

## نظرة عامة | Overview
هذا الدليل يوضح كيفية إعداد نطاق مخصص لموقع GitHub Pages.
This guide explains how to set up a custom domain for a GitHub Pages site.

---

## الخطوات الأساسية | Basic Steps

### 1. شراء وتسجيل النطاق | Domain Registration
- اختر مزود خدمة النطاقات (Domain Registrar)
- سجل النطاق المطلوب (في هذا المشروع: `wasl.store`)

### 2. إعداد DNS | DNS Configuration

#### السجلات المطلوبة | Required DNS Records:

**سجلات A للنطاق الرئيسي | A Records for Root Domain:**
```
Type: A
Name: @ (أو اتركه فارغاً)
Value: 185.199.108.153
TTL: 300

Type: A
Name: @ (أو اتركه فارغاً)
Value: 185.199.109.153
TTL: 300

Type: A
Name: @ (أو اتركه فارغاً)
Value: 185.199.110.153
TTL: 300

Type: A
Name: @ (أو اتركه فارغاً)
Value: 185.199.111.153
TTL: 300
```

**سجل CNAME للنطاق الفرعي www | CNAME Record for www subdomain:**
```
Type: CNAME
Name: www
Value: wasalstor-web.github.io.
TTL: 300
```

### 3. إعداد GitHub Pages | GitHub Pages Configuration

#### في إعدادات المستودع | In Repository Settings:
1. انتقل إلى Settings > Pages
2. في قسم "Source"، تأكد من اختيار "Deploy from a branch"
3. اختر الفرع "main" والمجلد "/ (root)"
4. في قسم "Custom domain"، أدخل: `wasl.store`
5. انقر "Save"
6. فعّل "Enforce HTTPS" (بعد التحقق من النطاق)

### 4. ملف CNAME | CNAME File
تأكد من وجود ملف `CNAME` في جذر المستودع يحتوي على:
```
wasl.store
```

---

## التحقق والاختبار | Verification and Testing

### 1. فحص إعدادات DNS | Check DNS Settings
```bash
# فحص سجلات A
nslookup wasl.store

# فحص سجل CNAME للـ www
nslookup www.wasl.store
```

### 2. فحص شهادة SSL | Check SSL Certificate
- انتظر 5-10 دقائق بعد الإعداد
- تحقق من `https://wasl.store`
- يجب أن تظهر شهادة صالحة

### 3. اختبار التوجيه | Test Redirects
- `http://wasl.store` → `https://wasl.store`
- `https://www.wasl.store` → `https://wasl.store`

---

## استكشاف الأخطاء | Troubleshooting

### مشاكل شائعة | Common Issues:

#### لا يعمل النطاق | Domain Not Working
- **السبب**: إعدادات DNS غير صحيحة
- **الحل**: تحقق من سجلات DNS والانتظار حتى 24-48 ساعة للانتشار

#### مشكلة شهادة SSL | SSL Certificate Issues
- **السبب**: لم يتم التحقق من النطاق بعد
- **الحل**: انتظر وأعد المحاولة، تأكد من صحة إعدادات DNS

#### رسالة "Domain's DNS record could not be retrieved"
- **السبب**: إعدادات DNS غير مكتملة
- **الحل**: تأكد من إضافة جميع سجلات A المطلوبة

---

## أدوات مفيدة | Useful Tools

### فحص DNS | DNS Checking:
- [DNS Checker](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)

### فحص SSL | SSL Checking:
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

---

## موارد إضافية | Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Record Types Explained](https://www.cloudflare.com/learning/dns/dns-records/)

---

## ملاحظات مهمة | Important Notes

1. **وقت الانتشار**: قد تستغرق تغييرات DNS من 5 دقائق إلى 48 ساعة للانتشار عالمياً
2. **الأمان**: استخدم دائماً HTTPS للمواقع الإنتاجية
3. **النسخ الاحتياطي**: احتفظ بنسخة من إعدادات DNS
4. **المراقبة**: راقب حالة الموقع بانتظام