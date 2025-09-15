# Gemma.cpp Integration | تكامل Gemma.cpp

## English

### About Gemma.cpp
This directory contains Google's Gemma.cpp as a git submodule - a lightweight, standalone C++ inference engine for the Gemma foundation models from Google.

**Source Repository**: [https://github.com/google/gemma.cpp](https://github.com/google/gemma.cpp)

### What is Gemma.cpp?
Gemma.cpp is designed for experimentation and research use cases. It provides:
- CPU-only inference for Gemma 2-3, Griffin(SSM), PaliGemma 2
- Lightweight implementation focusing on simplicity
- Minimal dependencies and easily modifiable core (~2K LoC)
- Support for mixed-precision operations (fp8, bf16, fp32, fp64)
- Weight compression integrated directly into GEMM operations

### Quick Usage
1. Follow installation instructions in `INSTALL.md`
2. Download model weights from Kaggle or Hugging Face
3. Build the project using CMake
4. Run inference using the provided script `run-gemma.sh`

---

## العربية

### حول Gemma.cpp
يحتوي هذا المجلد على Gemma.cpp من جوجل كـ git submodule - محرك استنتاج C++ خفيف ومستقل لنماذج Gemma الأساسية من جوجل.

**مستودع المصدر**: [https://github.com/google/gemma.cpp](https://github.com/google/gemma.cpp)

### ما هو Gemma.cpp؟
تم تصميم Gemma.cpp لحالات الاستخدام التجريبية والبحثية. يوفر:
- استنتاج بالمعالج فقط لـ Gemma 2-3، Griffin(SSM)، PaliGemma 2
- تنفيذ خفيف يركز على البساطة
- تبعيات قليلة ونواة قابلة للتعديل بسهولة (~2K LoC)
- دعم للعمليات المختلطة الدقة (fp8, bf16, fp32, fp64)
- ضغط الأوزان مدمج مباشرة في عمليات GEMM

### الاستخدام السريع
1. اتبع تعليمات التثبيت في `INSTALL.md`
2. قم بتنزيل أوزان النموذج من Kaggle أو Hugging Face
3. ابني المشروع باستخدام CMake
4. شغل الاستنتاج باستخدام السكريبت المرفق `run-gemma.sh`

---

## Integration Notes | ملاحظات التكامل

- **Model Storage**: Large model files (*.bin, *.sbs) should not be committed to git
- **Build Directory**: The `build/` directory will be created during compilation
- **Dependencies**: Requires CMake and Clang/GCC compiler

**تخزين النماذج**: ملفات النماذج الكبيرة (*.bin, *.sbs) يجب ألا تُرفع إلى git
**مجلد البناء**: سيتم إنشاء مجلد `build/` أثناء التجميع
**التبعيات**: يتطلب CMake ومترجم Clang/GCC