# Gemma.cpp Installation Guide | دليل تثبيت Gemma.cpp

## English

### Prerequisites
Before installing Gemma.cpp, ensure you have:
- **CMake** (3.14 or later): [https://cmake.org/](https://cmake.org/)
- **Clang/GCC** C++ compiler supporting C++17 or later
- **tar** for extracting archives from Kaggle
- **Git** for submodule management

### System Requirements
- **Linux**: Recommended (Ubuntu 18.04+, CentOS 7+)
- **macOS**: 10.14+ with Xcode Command Line Tools
- **Windows**: Visual Studio 2019+ with Clang/LLVM frontend

#### Windows Installation
```bash
winget install --id Kitware.CMake
winget install --id Microsoft.VisualStudio.2022.BuildTools --force --override "--passive --wait --add Microsoft.VisualStudio.Workload.VCTools;installRecommended --add Microsoft.VisualStudio.Component.VC.Llvm.Clang --add Microsoft.VisualStudio.Component.VC.Llvm.ClangToolset"
```

### Step 1: Initialize Submodule
If you haven't already initialized the submodule:
```bash
cd /path/to/wasl
git submodule update --init --recursive gemma
```

### Step 2: Download Model Weights
1. Visit [Kaggle Gemma-2 Models](https://www.kaggle.com/models/google/gemma-2/gemmaCpp)
2. Select `Model Variations > Gemma C++`
3. Choose a model (recommended: `gemma2-2b-it-sfp` for beginners)
4. Accept the license and download `archive.tar.gz`

### Step 3: Extract Model Files
```bash
cd gemma
mkdir models
cd models
tar -xf /path/to/archive.tar.gz
```
This creates files like `2b-it-sfp.sbs` and `tokenizer.spm`.

### Step 4: Build Gemma.cpp
```bash
cd /path/to/wasl/gemma
cmake -B build
cd build
make -j$(nproc)
```

### Step 5: Test Installation
```bash
./gemma --tokenizer ../models/tokenizer.spm --compressed_weights ../models/2b-it-sfp.sbs --model 2b-it
```

---

## العربية

### المتطلبات المسبقة
قبل تثبيت Gemma.cpp، تأكد من وجود:
- **CMake** (الإصدار 3.14 أو أحدث): [https://cmake.org/](https://cmake.org/)
- **Clang/GCC** مترجم C++ يدعم C++17 أو أحدث
- **tar** لاستخراج الأرشيف من Kaggle
- **Git** لإدارة الوحدات الفرعية

### متطلبات النظام
- **Linux**: موصى به (Ubuntu 18.04+، CentOS 7+)
- **macOS**: 10.14+ مع Xcode Command Line Tools
- **Windows**: Visual Studio 2019+ مع Clang/LLVM frontend

#### تثبيت Windows
```bash
winget install --id Kitware.CMake
winget install --id Microsoft.VisualStudio.2022.BuildTools --force --override "--passive --wait --add Microsoft.VisualStudio.Workload.VCTools;installRecommended --add Microsoft.VisualStudio.Component.VC.Llvm.Clang --add Microsoft.VisualStudio.Component.VC.Llvm.ClangToolset"
```

### الخطوة 1: تهيئة الوحدة الفرعية
إذا لم تقم بتهيئة الوحدة الفرعية بعد:
```bash
cd /path/to/wasl
git submodule update --init --recursive gemma
```

### الخطوة 2: تنزيل أوزان النموذج
1. زر [نماذج Kaggle Gemma-2](https://www.kaggle.com/models/google/gemma-2/gemmaCpp)
2. اختر `Model Variations > Gemma C++`
3. اختر نموذجاً (موصى: `gemma2-2b-it-sfp` للمبتدئين)
4. اقبل الترخيص وحمل `archive.tar.gz`

### الخطوة 3: استخراج ملفات النموذج
```bash
cd gemma
mkdir models
cd models
tar -xf /path/to/archive.tar.gz
```
هذا ينشئ ملفات مثل `2b-it-sfp.sbs` و `tokenizer.spm`.

### الخطوة 4: بناء Gemma.cpp
```bash
cd /path/to/wasl/gemma
cmake -B build
cd build
make -j$(nproc)
```

### الخطوة 5: اختبار التثبيت
```bash
./gemma --tokenizer ../models/tokenizer.spm --compressed_weights ../models/2b-it-sfp.sbs --model 2b-it
```

---

## Troubleshooting | استكشاف الأخطاء

### Common Issues | المشاكل الشائعة

**Build fails with missing dependencies:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install cmake clang build-essential

# CentOS/RHEL
sudo yum install cmake clang gcc-c++ make

# macOS
xcode-select --install
brew install cmake
```

**Memory errors during build:**
```bash
# Use fewer parallel jobs
make -j2  # instead of -j$(nproc)
```

**Model file not found:**
- Ensure model files are in `gemma/models/` directory
- Check file permissions: `chmod 644 *.sbs *.spm`

---

## Performance Tips | نصائح الأداء

1. **Use SFP models** for better speed vs accuracy balance
2. **Compile with optimizations**: `CMAKE_BUILD_TYPE=Release`
3. **Use all CPU cores**: Set appropriate thread count for your system
4. **Monitor memory usage**: Large models may require 8GB+ RAM

For advanced configuration, see the original [Gemma.cpp README](README.md).