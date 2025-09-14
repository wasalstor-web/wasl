# دمج مشروع Google Gemma.cpp في منصة وسل

## نظرة عامة

تم دمج مشروع **Google Gemma.cpp** في منصة وسل لتوفير إمكانيات الذكاء الاصطناعي المحلية. Gemma.cpp هو مشروع مفتوح المصدر من جوجل يتيح تشغيل نماذج Gemma الذكية محلياً على الجهاز بدون الحاجة لاتصال بالإنترنت.

## عن مشروع Google Gemma.cpp

**Gemma.cpp** هو تطبيق C++ عالي الأداء لتشغيل نماذج Gemma من Google. يوفر المشروع:

- تشغيل محلي للنماذج الذكية بدون إنترنت
- أداء عالي ومحسن للمعالجات المختلفة
- واجهة سطر أوامر سهلة الاستخدام
- دعم للأجهزة متعددة الأنواع

### روابط المشروع الأصلي

- **المستودع الرسمي**: https://github.com/google/gemma.cpp
- **التوثيق**: https://ai.google.dev/gemma
- **نماذج Gemma**: https://huggingface.co/google/gemma-2b-it
- **الترخيص**: Apache 2.0 (مفتوح المصدر)

## هيكل المشروع

```
gemma/
├── include/           # ملفات الرؤوس (Headers)
│   └── gemma.h       # واجهة برمجة التطبيقات الرئيسية
├── src/              # الكود المصدري
│   ├── gemma.cpp     # تطبيق المكتبة الأساسية
│   └── main.cpp      # واجهة سطر الأوامر
├── scripts/          # النصوص المساعدة
│   ├── build.sh      # نص البناء
│   └── test.sh       # نص الاختبار
├── models/           # مجلد النماذج (يُنشأ عند البناء)
├── examples/         # الأمثلة
└── CMakeLists.txt    # ملف البناء الرئيسي
```

## متطلبات النظام

### الحد الأدنى
- نظام التشغيل: Linux, macOS, أو Windows (مع WSL)
- المعالج: x86-64 أو ARM64
- الذاكرة: 4 GB RAM (8 GB مستحسن)
- المساحة: 2 GB مساحة فارغة

### أدوات التطوير المطلوبة
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install build-essential cmake git

# macOS
brew install cmake
xcode-select --install

# CentOS/RHEL
sudo yum groupinstall "Development Tools"
sudo yum install cmake
```

## طريقة التثبيت

### 1. بناء المشروع

```bash
# الانتقال إلى مجلد gemma
cd gemma

# تشغيل نص البناء
./scripts/build.sh
```

### 2. اختبار التثبيت

```bash
# تشغيل الاختبارات
./scripts/test.sh
```

## طريقة الاستخدام

### الاستخدام الأساسي

```bash
# عرض تعليمات الاستخدام
./build/bin/gemma_cli --help

# تشغيل نص بسيط
./build/bin/gemma_cli --prompt "مرحبا، كيف يمكنني مساعدتك؟"

# تشغيل مع معاملات مخصصة
./build/bin/gemma_cli --prompt "ما هو الذكاء الاصطناعي؟" --max_tokens 200 --temperature 0.7
```

### الوضع التفاعلي

```bash
# بدء الوضع التفاعلي
./build/bin/gemma_cli --interactive

# ثم أدخل النصوص واضغط Enter
> مرحبا، كيف حالك؟
> ما هي أفضل طريقة لتعلم البرمجة؟
> اكتب لي قصة قصيرة
> quit  # للخروج
```

### مع نماذج حقيقية

```bash
# تحميل نموذج Gemma من Hugging Face
# (يتطلب git-lfs)
git clone https://huggingface.co/google/gemma-2b-it models/gemma-2b

# تشغيل مع النموذج
./build/bin/gemma_cli --model models/gemma-2b/model.bin --prompt "Hello!"
```

## الأمثلة

### مثال 1: توليد نص عربي
```bash
./build/bin/gemma_cli --prompt "اكتب مقالاً قصيراً عن أهمية التكنولوجيا في التعليم" --max_tokens 300
```

### مثال 2: الإجابة على أسئلة
```bash
./build/bin/gemma_cli --prompt "ما هي فوائد استخدام الذكاء الاصطناعي في النقل والتوصيل؟"
```

### مثال 3: المساعدة في البرمجة
```bash
./build/bin/gemma_cli --prompt "اشرح لي كيفية كتابة دالة في Python لحساب المتوسط"
```

## المعاملات والخيارات

| المعامل | الوصف | القيمة الافتراضية |
|---------|--------|------------------|
| `--model` | مسار ملف النموذج | demo.bin |
| `--tokenizer` | مسار ملف المُقطِّع | - |
| `--prompt` | النص المدخل | - |
| `--max_tokens` | عدد الرموز الأقصى | 256 |
| `--temperature` | درجة العشوائية (0.0-1.0) | 0.7 |
| `--interactive` | الوضع التفاعلي | false |
| `--help` | عرض المساعدة | - |

## التعارضات والملاحظات

### التعارضات المحتملة
- **لا توجد تعارضات** مع الملفات الموجودة في المشروع
- تم إنشاء مجلد `gemma/` منفصل لتجنب أي تداخل
- ملف `.gitignore` تم تحديثه لاستثناء ملفات البناء

### ملاحظات مهمة
- هذا التطبيق هو **نسخة مبسطة** لأغراض العرض والاختبار
- للاستخدام الإنتاجي، يُنصح بتحميل النماذج الرسمية من Google
- النماذج الحقيقية تتطلب مساحة كبيرة (2-7 GB لكل نموذج)
- الأداء يعتمد على قوة المعالج والذاكرة المتاحة

## الأداء والتحسين

### نصائح لتحسين الأداء
```bash
# بناء محسن للسرعة
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j$(nproc)
```

### مراقبة استخدام الموارد
```bash
# مراقبة الذاكرة أثناء التشغيل
htop

# مراقبة استخدام المعالج
iostat -x 1
```

## استكشاف الأخطاء

### مشاكل البناء الشائعة

```bash
# خطأ: cmake غير موجود
sudo apt install cmake

# خطأ: compiler غير موجود  
sudo apt install build-essential

# خطأ: لا توجد صلاحيات
chmod +x scripts/*.sh
```

### مشاكل التشغيل

```bash
# خطأ: النموذج غير موجود
# الحل: استخدم الوضع التجريبي أو حمل نموذج حقيقي
./build/bin/gemma_cli --prompt "test"

# خطأ: نفاد الذاكرة
# الحل: استخدم نموذج أصغر أو قلل max_tokens
./build/bin/gemma_cli --prompt "test" --max_tokens 50
```

## التطوير والمساهمة

### إضافة ميزات جديدة
1. عدل الملفات في `src/`
2. أضف اختبارات في `scripts/test.sh`
3. حدث التوثيق في هذا الملف

### بناء نسخة مخصصة
```bash
# تعديل CMakeLists.txt لإضافة مكتبات جديدة
# إعادة البناء
./scripts/build.sh
```

## المراجع والموارد

### التوثيق الرسمي
- [Gemma Model Documentation](https://ai.google.dev/gemma/docs)
- [Gemma.cpp GitHub](https://github.com/google/gemma.cpp)
- [Hugging Face Gemma Models](https://huggingface.co/models?search=gemma)

### الأدلة والبرامج التعليمية
- [دليل استخدام Gemma](https://ai.google.dev/gemma/docs/get_started)
- [تحسين أداء النماذج](https://ai.google.dev/gemma/docs/formatting)
- [أمثلة متقدمة](https://github.com/google/gemma.cpp/tree/main/examples)

---

## معلومات الترخيص

هذا المشروع يستخدم كود من **Google Gemma.cpp** المرخص تحت **Apache License 2.0**.

### حقوق الطبع والنشر
```
Copyright 2024 Google LLC
SPDX-License-Identifier: Apache-2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
```

### إسناد المشروع الأصلي
- **المشروع الأصلي**: Google Gemma.cpp
- **المطور**: Google LLC
- **الترخيص**: Apache 2.0 (مفتوح المصدر)
- **الرابط**: https://github.com/google/gemma.cpp

---

**تم الدمج بواسطة فريق منصة وسل**  
لأي استفسارات أو دعم، يرجى التواصل معنا.