# Gemma.cpp - تشغيل نماذج الذكاء الاصطناعي Gemma محلياً

## نبذة عن المشروع

Gemma.cpp هو مشروع مفتوح المصدر من شركة جوجل لتشغيل نماذج الذكاء الاصطناعي Gemma محلياً باستخدام لغة C++. هذا المشروع يوفر محرك استدلال خفيف وسريع لنماذج Gemma-2، Gemma-3، و PaliGemma-2.

## المصدر الأصلي

- **المشروع الأصلي**: [google/gemma.cpp](https://github.com/google/gemma.cpp)
- **التوثيق الرسمي**: [ai.google.dev/gemma](https://ai.google.dev/gemma)
- **نماذج Gemma**: [Kaggle - Gemma Models](https://www.kaggle.com/models/google/gemma-2)
- **الرخصة**: Apache 2.0 و BSD-3-Clause

## متطلبات النظام

قبل البدء، تأكد من تثبيت التالي:

### متطلبات أساسية
- [CMake](https://cmake.org/) (الإصدار 3.18 أو أحدث)
- [Clang C++ compiler](https://clang.llvm.org/get_started.html) (دعم C++17 على الأقل)
- `tar` لاستخراج ملفات النماذج من Kaggle

### نظام Linux/macOS
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install cmake clang build-essential

# macOS (باستخدام Homebrew)
brew install cmake llvm
```

### نظام Windows
```powershell
# باستخدام winget
winget install --id Kitware.CMake
winget install --id Microsoft.VisualStudio.2022.BuildTools --force --override "--passive --wait --add Microsoft.VisualStudio.Workload.VCTools;installRecommended --add Microsoft.VisualStudio.Component.VC.Llvm.Clang --add Microsoft.VisualStudio.Component.VC.Llvm.ClangToolset"
```

## خطوات التثبيت والتشغيل

### الخطوة 1: الحصول على نماذج Gemma من Kaggle

1. انتقل إلى [صفحة Gemma-2 على Kaggle](https://www.kaggle.com/models/google/gemma-2/gemmaCpp)
2. اختر `Model Variations |> Gemma C++`
3. نوصي بالبدء بـ `gemma2-2b-it-sfp` للاختبار الأولي
4. املأ نموذج الموافقة وحمّل الملف

### الخطوة 2: استخراج الملفات

```bash
# استخراج ملفات النموذج
tar -xf archive.tar.gz

# نقل الملفات إلى مجلد البناء
mkdir build
mv *.sbs tokenizer.spm build/
```

### الخطوة 3: بناء المشروع

```bash
# إنشاء مجلد البناء وتكوين CMake
cmake -B build

# الدخول إلى مجلد البناء والبناء
cd build
make -j$(nproc)
```

### الخطوة 4: تشغيل النموذج

```bash
# تشغيل النموذج التفاعلي
./gemma --tokenizer tokenizer.spm --weights 2b-it-sfp.sbs

# تشغيل النموذج مع سؤال محدد
./gemma --tokenizer tokenizer.spm --weights 2b-it-sfp.sbs --text "ما هو الذكاء الاصطناعي؟"
```

## أمثلة الاستخدام

### التشغيل التفاعلي
```bash
./gemma --tokenizer tokenizer.spm --weights 2b-it-sfp.sbs
> مرحباً، كيف يمكنني مساعدتك؟
```

### تشغيل استعلام مباشر
```bash
./gemma --tokenizer tokenizer.spm --weights 2b-it-sfp.sbs --text "اشرح لي البرمجة"
```

### تخصيص معاملات التوليد
```bash
./gemma --tokenizer tokenizer.spm --weights 2b-it-sfp.sbs --text "اكتب قصة قصيرة" --max_tokens 200 --temperature 0.8
```

## النماذج المتاحة

### Gemma-2 Models
- `gemma2-2b-it-sfp` - نموذج 2 مليار معامل (مناسب للبداية)
- `gemma2-9b-it-sfp` - نموذج 9 مليار معامل
- `gemma2-27b-it-sfp` - نموذج 27 مليار معامل

### أنواع الضغط
- `sfp` - Switched Floating Point (أسرع، دقة جيدة)
- `bf16` - BFloat16 (دقة عالية، حجم أكبر)

## استكشاف الأخطاء

### مشاكل شائعة

#### خطأ في بناء المشروع
```bash
# تنظيف مجلد البناء وإعادة المحاولة
rm -rf build/*
cmake -B build
cd build && make -j$(nproc)
```

#### نفاد الذاكرة
```bash
# استخدام نموذج أصغر
./gemma --tokenizer tokenizer.spm --weights 2b-it-sfp.sbs
```

#### ملف النموذج غير موجود
```bash
# التأكد من وجود الملفات
ls -la *.sbs tokenizer.spm
```

## معاملات التشغيل المتقدمة

```bash
# المعاملات الأساسية
--tokenizer          # مسار ملف المحلل اللغوي
--weights           # مسار ملف النموذج
--text              # النص المطلوب معالجته

# معاملات التوليد
--max_tokens        # أقصى عدد رموز (افتراضي: 3072)
--temperature       # مستوى العشوائية (0.0-2.0، افتراضي: 1.0)
--seed              # بذرة العشوائية للتكرارية

# معاملات الأداء
--num_threads       # عدد خيوط المعالجة
--verbosity         # مستوى التفصيل في الرسائل
```

## التكامل مع التطبيقات

### استخدام واجهة C++
```cpp
#include "gemma/gemma.h"
#include "util/args.h"

// مثال بسيط لاستخدام Gemma في التطبيق
```

### استخدام واجهة Python
```python
# تثبيت المتطلبات
pip install -r compression/python/requirements.txt

# استخدام Python bindings
import gemma_py
```

## بنية المشروع

```
gemma-cpp/
├── gemma/          # كود المحرك الأساسي
├── compression/    # ضغط النماذج والتحسينات
├── ops/           # عمليات الجبر الخطي المحسّنة
├── util/          # أدوات مساعدة
├── examples/      # أمثلة للاستخدام
├── io/           # عمليات دخل وخرج الملفات
├── CMakeLists.txt # ملف بناء CMake
└── BUILD.bazel   # ملف بناء Bazel
```

## التعارضات والملاحظات

### تعارضات محتملة
- **ملف LICENSE**: يحتوي المشروع على رخصتين (Apache 2.0 و BSD-3)
- **متطلبات البناء**: يتطلب مكتبات C++ حديثة قد لا تكون متوفرة في أنظمة قديمة
- **استهلاك الذاكرة**: النماذج الكبيرة تتطلب ذاكرة كبيرة (> 16GB للنماذج الكبيرة)

### حلول للتعارضات
1. **استخدام Docker**: لتجنب مشاكل البيئة
2. **النماذج الصغيرة**: البدء بـ 2B model للاختبار
3. **التحديث التدريجي**: ترقية مكتبات النظام حسب الحاجة

## الموارد والدعم

### التوثيق الأصلي
- [دليل المطورين](DEVELOPERS.md)
- [أمثلة الاستخدام](examples/)
- [Discord Community](https://discord.gg/H5jCBAWxAe)

### دعم إضافي
- **المشاكل التقنية**: [GitHub Issues](https://github.com/google/gemma.cpp/issues)
- **المناقشات**: [GitHub Discussions](https://github.com/google/gemma.cpp/discussions)
- **التحديثات**: [Release Notes](https://github.com/google/gemma.cpp/releases)

## الإسهام في التطوير

هذا مشروع مفتوح المصدر ونرحب بالمساهمات:

1. **Fork** المشروع الأصلي
2. إنشاء **branch** جديد للميزة
3. **Commit** التغييرات
4. **Push** إلى الـ branch
5. إنشاء **Pull Request**

## حقوق الطبع والنشر

- **المشروع الأصلي**: Copyright 2024 Google LLC
- **الرخصة**: Apache License 2.0 و BSD-3-Clause License
- **التكامل**: تم دمج المشروع دون تعديلات جوهرية في الكود الأساسي

---

## ملاحظة مهمة

هذا المشروع مدمج كما هو من مستودع Google الأصلي. لم يتم إجراء تعديلات جوهرية على الكود الأساسي، فقط إضافة هذا الدليل باللغة العربية لتسهيل الاستخدام. للحصول على أحدث التحديثات، يُرجى الرجوع إلى المستودع الأصلي.

**تم إنشاء هذا الدليل لتسهيل استخدام مشروع Gemma.cpp في البيئة العربية.**