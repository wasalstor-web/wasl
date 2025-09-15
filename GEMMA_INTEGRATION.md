# دليل دمج Gemma.cpp

## نظرة عامة

تم دمج منصة وسل مع [Gemma.cpp](https://github.com/google/gemma.cpp) - محرك الاستنتاج الخفيف والمستقل من Google لنماذج Gemma الأساسية.

## ما هو Gemma.cpp؟

Gemma.cpp هو محرك استنتاج C++ خفيف ومستقل يوفر:

- **تنفيذ مبسط**: حوالي 2K سطر من الكود الأساسي
- **نماذج متعددة**: دعم Gemma-2، Gemma-3، و PaliGemma-2
- **أداء محسن**: استخدام Google Highway للاستفادة من SIMD
- **سهولة التضمين**: اعتماديات قليلة وسهل التعديل

## النماذج المدعومة

### Gemma-2
نموذج لغوي متقدم للمحادثات والنصوص مع:
- قدرات محادثة طبيعية
- فهم السياق المتقدم
- دعم اللغات المتعددة

### Gemma-3
أحدث إصدار مع تحسينات في:
- سرعة الاستجابة
- دقة الفهم
- كفاءة الذاكرة

### PaliGemma-2
نموذج متعدد الوسائط يدعم:
- معالجة النصوص والصور
- فهم السياق البصري
- إنتاج محتوى متعدد الوسائط

## التثبيت والإعداد

### متطلبات النظام
```bash
# C++ compiler مع دعم C++17
# CMake 3.15 أو أحدث
# Google Highway library
```

### خطوات التثبيت
```bash
# استنساخ المستودع
git clone https://github.com/google/gemma.cpp.git

# إنشاء مجلد البناء
cd gemma.cpp
mkdir build && cd build

# تكوين وبناء المشروع
cmake ..
make -j$(nproc)
```

### تحميل أوزان النماذج
يمكن تحميل أوزان النماذج من [Kaggle](https://www.kaggle.com/models/google/gemma-2):

1. قم بإنشاء حساب على Kaggle
2. قبول شروط استخدام النماذج
3. تحميل ملفات الأوزان
4. ضعها في المجلد المناسب

## الاستخدام في منصة وسل

### تشغيل النموذج
```cpp
#include "gemma.h"

// تحميل النموذج
gemma::Model model("path/to/model/weights");

// تشغيل الاستنتاج
std::string response = model.generate("مرحباً، كيف يمكنني مساعدتك؟");
```

### التكامل مع الويب
```javascript
// استدعاء API للنموذج
async function queryGemma(prompt) {
    const response = await fetch('/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    return await response.json();
}
```

## حالات الاستخدام

### 1. المساعد الذكي للنقل
- **الاستعلامات**: "ما هي أفضل طريقة للوصول إلى المطار؟"
- **التخطيط**: "خطط لي رحلة توصيل بين الرياض وجدة"
- **التتبع**: "أين موقع الشحنة رقم #12345؟"

### 2. تحليل البيانات
- **التقارير**: تحليل بيانات الرحلات وإنتاج تقارير
- **التنبؤ**: توقع أوقات الذروة وتحسين الطرق
- **التوصيات**: اقتراح تحسينات للخدمة

### 3. دعم العملاء
- **الردود التلقائية**: إجابة الاستفسارات الشائعة
- **حل المشاكل**: تشخيص وحل مشاكل التوصيل
- **الترجمة**: دعم العملاء بلغات متعددة

## التحسين والأداء

### إعدادات الذاكرة
```cpp
// تحسين استخدام الذاكرة
gemma::ModelConfig config;
config.max_memory_mb = 4096;  // 4GB
config.cache_size = 1024;     // 1GB cache
```

### معايرة الأداء
```bash
# قياس سرعة الاستنتاج
./benchmark --model=gemma-2 --prompts=test_prompts.txt

# مراقبة استخدام الموارد
htop  # أو أدوات مراقبة أخرى
```

## الأمان والخصوصية

### حماية البيانات
- تشفير البيانات المرسلة للنموذج
- عدم حفظ المحادثات الحساسة
- تنظيف الذاكرة بعد كل جلسة

### التحكم في الوصول
```cpp
// التحقق من صلاحيات المستخدم
bool validateAccess(const std::string& userId, const std::string& action) {
    // منطق التحقق من الصلاحيات
    return hasPermission(userId, action);
}
```

## استكشاف الأخطاء

### مشاكل شائعة

#### خطأ في تحميل النموذج
```
خطأ: فشل في تحميل ملف النموذج
الحل: تحقق من مسار الملف وصلاحيات القراءة
```

#### نفاد الذاكرة
```
خطأ: OutOfMemoryError
الحل: قلل من حجم النموذج أو زيد من ذاكرة النظام
```

#### بطء الاستجابة
```
مشكلة: استجابة بطيئة
الحل: استخدم تسريع GPU أو قلل من طول النص المُدخل
```

## المساهمة والتطوير

### انضمام للمجتمع
- [Discord Community](https://discord.gg/H5jCBAWxAe)
- [دليل المساهمين](https://github.com/google/gemma.cpp/blob/main/DEVELOPERS.md)
- [إرشادات المجتمع](https://opensource.google.com/conduct/)

### التطوير المحلي
```bash
# فرع التطوير النشط
git checkout dev

# تشغيل الاختبارات
make test

# إنشاء pull request
git push origin feature/my-feature
```

## الترخيص والقوانين

يخضع Gemma.cpp لتراخيص متعددة:
- [Apache License 2.0](https://github.com/google/gemma.cpp/blob/main/LICENSE)
- [BSD-3-Clause License](https://github.com/google/gemma.cpp/blob/main/LICENSE-BSD3)

تأكد من مراجعة شروط الاستخدام قبل الاستخدام التجاري.

---

**آخر تحديث**: تم الدمج مع Gemma.cpp من Google