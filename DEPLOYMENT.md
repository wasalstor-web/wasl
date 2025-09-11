# دليل النشر على المنصات المجانية

## النشر على Netlify

### الطريقة الأولى: من GitHub (موصى بها)
1. اذهب إلى [netlify.com](https://netlify.com)
2. قم بإنشاء حساب أو تسجيل الدخول
3. اضغط على "New site from Git"
4. اختر GitHub واربط حسابك
5. اختر مستودع `wasalstor-web/wasl`
6. Netlify سيكتشف تلقائياً ملف `netlify.toml`
7. اضغط "Deploy site"
8. ستحصل على رابط مجاني مثل: `https://amazing-site-name.netlify.app`

### الطريقة الثانية: رفع الملفات مباشرة
1. اذهب إلى [netlify.com](https://netlify.com)
2. اسحب وأفلت مجلد المشروع على الصفحة الرئيسية
3. ستحصل على رابط فوري

## النشر على Vercel

### الطريقة الأولى: من GitHub (موصى بها)
1. اذهب إلى [vercel.com](https://vercel.com)
2. قم بإنشاء حساب أو تسجيل الدخول
3. اضغط على "New Project"
4. اربط حسابك بـ GitHub
5. اختر مستودع `wasalstor-web/wasl`
6. Vercel سيكتشف تلقائياً ملف `vercel.json`
7. اضغط "Deploy"
8. ستحصل على رابط مجاني مثل: `https://wasl-project.vercel.app`

### الطريقة الثانية: Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# في مجلد المشروع
vercel

# اتبع التعليمات على الشاشة
```

## النشر على GitHub Pages (الحالي)
المشروع يحتوي على workflow جاهز لـ GitHub Pages في `.github/workflows/jekyll-gh-pages.yml`

## منصات أخرى مجانية
- **Surge.sh**: `npm install -g surge && surge`
- **Firebase Hosting**: باستخدام Firebase CLI
- **GitHub Pages**: مفعل تلقائياً لهذا المستودع

## ملاحظات مهمة
- جميع المنصات المذكورة تقدم HTTPS مجاناً
- يمكن ربط دومين مخصص مجاناً
- التحديثات تتم تلقائياً عند دفع تغييرات إلى GitHub
- لا حاجة لبناء أو تجميع - الموقع HTML ثابت