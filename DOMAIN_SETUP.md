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

### 0. عرض الإعدادات المطلوبة | Show Required Configuration
```bash
# عرض إعدادات DNS المطلوبة
./show-dns-config.sh
```

### 1. فحص إعدادات DNS | Check DNS Settings
```bash
# فحص سجلات A
nslookup wasl.store

# فحص سجل CNAME للـ www
nslookup www.wasl.store

# تشغيل سكريبت التحقق الشامل
./verify-domain.sh
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
- **خطوات التشخيص**:
  ```bash
  # فحص سجلات A
  nslookup wasl.store
  # أو استخدم
  dig wasl.store A
  ```

#### مشكلة شهادة SSL | SSL Certificate Issues
- **السبب**: لم يتم التحقق من النطاق بعد
- **الحل**: انتظر وأعد المحاولة، تأكد من صحة إعدادات DNS
- **ملاحظة**: قد تستغرق شهادة SSL من 5-10 دقائق للتفعيل بعد إعداد DNS

#### رسالة "Domain's DNS record could not be retrieved"
- **السبب**: إعدادات DNS غير مكتملة
- **الحل**: تأكد من إضافة جميع سجلات A المطلوبة
- **التحقق**: استخدم سكريبت التحقق `./verify-domain.sh`

#### رسالة "REFUSED" في DNS
- **السبب**: النطاق غير مُسجل أو DNS غير مُعد
- **الحل**: 
  1. تأكد من تسجيل النطاق عند مزود الخدمة
  2. قم بإعداد DNS servers الصحيحة
  3. أضف السجلات المطلوبة

#### www لا يعمل | www subdomain not working
- **السبب**: سجل CNAME مفقود أو غير صحيح
- **الحل**: أضف سجل CNAME:
  ```
  Type: CNAME
  Name: www
  Value: wasalstor-web.github.io.
  TTL: 300
  ```

### خطوات التشخيص المتقدم | Advanced Diagnostics

#### 1. فحص انتشار DNS عالمياً | Check Global DNS Propagation
```bash
# فحص من عدة خوادم DNS
nslookup wasl.store 8.8.8.8          # Google DNS
nslookup wasl.store 1.1.1.1          # Cloudflare DNS
nslookup wasl.store 208.67.222.222   # OpenDNS
```

#### 2. فحص تاريخ انتهاء النطاق | Check Domain Expiration
```bash
whois wasl.store | grep -i expir
```

#### 3. فحص Name Servers | Check Name Servers
```bash
nslookup -type=NS wasl.store
```

#### 4. اختبار الاتصال المباشر | Test Direct Connection
```bash
# فحص الاتصال بـ GitHub Pages
curl -I https://wasalstor-web.github.io
```

### حلول سريعة | Quick Fixes

#### إذا كانت السجلات صحيحة ولكن لا تعمل | If records are correct but not working:
1. **امسح cache DNS المحلي**:
   ```bash
   # على Linux/Mac
   sudo systemctl flush-dns
   # أو
   sudo dscacheutil -flushcache
   ```

2. **جرب DNS مختلف مؤقتاً**:
   - استخدم 8.8.8.8 (Google) أو 1.1.1.1 (Cloudflare)

3. **تحقق من إعدادات GitHub Pages**:
   - تأكد من تفعيل Custom Domain في Settings > Pages
   - تأكد من وجود ملف CNAME في المستودع

#### إذا ظهرت أخطاء SSL | If SSL errors appear:
1. **انتظر**: قد تستغرق الشهادة حتى 24 ساعة
2. **تحقق من HTTPS enforcement**: قم بإيقافه مؤقتاً ثم أعد تفعيله
3. **استخدم أدوات فحص SSL**:
   - https://www.ssllabs.com/ssltest/
   - https://www.sslshopper.com/ssl-checker.html

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

## قائمة مراجعة استكشاف الأخطاء | Troubleshooting Checklist

### ✅ قبل البدء | Before Starting:
- [ ] تم تسجيل النطاق وهو نشط
- [ ] لديك صلاحية تعديل إعدادات DNS
- [ ] تحققت من إعدادات GitHub Pages

### 🔍 فحص DNS | DNS Check:
- [ ] تم إضافة جميع سجلات A الأربعة
- [ ] تم إضافة سجل CNAME للـ www
- [ ] Name Servers صحيحة
- [ ] انتظرت على الأقل 15 دقيقة بعد التغيير

### 🌐 فحص الاتصال | Connectivity Check:
- [ ] `nslookup wasl.store` يُرجع عناوين IP صحيحة
- [ ] `nslookup www.wasl.store` يُرجع wasalstor-web.github.io
- [ ] `https://wasl.store` يعمل
- [ ] `https://www.wasl.store` يُوجه إلى wasl.store

### 🔧 إذا لم يعمل شيء | If Nothing Works:
1. **شغّل سكريبت التحقق**:
   ```bash
   ./verify-domain.sh
   ```

2. **تحقق من إعدادات GitHub**:
   - Settings > Pages > Custom domain: `wasl.store`
   - ملف CNAME موجود في المستودع

3. **اتصل بمزود النطاق**:
   - تأكد من أن النطاق نشط
   - اطلب مساعدة في إعداد DNS

### 📞 الحصول على المساعدة | Getting Help:
- راجع [GitHub Pages Documentation](https://docs.github.com/en/pages)
- استخدم [GitHub Community](https://github.community/)
- تحقق من [GitHub Status](https://www.githubstatus.com/)

---

## ملاحظات مهمة | Important Notes

1. **وقت الانتشار**: قد تستغرق تغييرات DNS من 5 دقائق إلى 48 ساعة للانتشار عالمياً
2. **الأمان**: استخدم دائماً HTTPS للمواقع الإنتاجية
3. **النسخ الاحتياطي**: احتفظ بنسخة من إعدادات DNS
4. **المراقبة**: راقب حالة الموقع بانتظام