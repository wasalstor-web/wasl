#!/bin/bash

# Gemma.cpp Build and Test Script - سكريبت بناء واختبار Gemma.cpp
# تأكد من وجود متطلبات البناء قبل تشغيل هذا السكريبت

set -e  # Exit on error

echo "🚀 بدء عملية بناء Gemma.cpp..."
echo "Starting Gemma.cpp build process..."

# التحقق من وجود المجلد
if [ ! -d "gemma-cpp" ]; then
    echo "❌ مجلد gemma-cpp غير موجود!"
    echo "❌ gemma-cpp directory not found!"
    exit 1
fi

cd gemma-cpp

echo "📁 الانتقال إلى مجلد gemma-cpp..."
echo "📁 Entering gemma-cpp directory..."

# التحقق من متطلبات البناء
echo "🔍 التحقق من متطلبات البناء..."
echo "🔍 Checking build requirements..."

# Check for CMake
if ! command -v cmake &> /dev/null; then
    echo "❌ CMake غير مثبت. يرجى تثبيت CMake أولاً."
    echo "❌ CMake not found. Please install CMake first."
    exit 1
fi

# Check for C++ compiler
if ! command -v clang++ &> /dev/null && ! command -v g++ &> /dev/null; then
    echo "❌ مترجم C++ غير موجود. يرجى تثبيت clang++ أو g++."
    echo "❌ C++ compiler not found. Please install clang++ or g++."
    exit 1
fi

echo "✅ متطلبات البناء متوفرة."
echo "✅ Build requirements satisfied."

# إنشاء مجلد البناء
echo "📂 إنشاء مجلد البناء..."
echo "📂 Creating build directory..."

if [ -d "build" ]; then
    echo "🧹 تنظيف مجلد البناء الموجود..."
    echo "🧹 Cleaning existing build directory..."
    rm -rf build/*
fi

mkdir -p build

# تكوين CMake
echo "⚙️  تكوين المشروع باستخدام CMake..."
echo "⚙️  Configuring project with CMake..."

cmake -B build -DCMAKE_BUILD_TYPE=Release

# البناء
echo "🔨 بناء المشروع..."
echo "🔨 Building project..."

cd build
make -j$(nproc) 2>&1 | tee build.log

# التحقق من نجاح البناء
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 تم بناء Gemma.cpp بنجاح!"
    echo "🎉 Gemma.cpp built successfully!"
    echo ""
    echo "📋 الملفات المُنشأة:"
    echo "📋 Generated files:"
    ls -la gemma* 2>/dev/null || echo "لا توجد ملفات gemma* في مجلد البناء"
    echo ""
    echo "📖 للاستخدام:"
    echo "📖 To use:"
    echo "   1. احصل على نماذج Gemma من Kaggle"
    echo "   1. Get Gemma models from Kaggle"
    echo "   2. ./gemma --tokenizer tokenizer.spm --weights model.sbs"
    echo ""
    echo "📚 اقرأ README_ARABIC.md للتعليمات التفصيلية"
    echo "📚 Read README_ARABIC.md for detailed instructions"
else
    echo ""
    echo "❌ فشل في بناء المشروع. راجع build.log للتفاصيل."
    echo "❌ Build failed. Check build.log for details."
    echo ""
    echo "🔍 آخر 20 سطر من سجل البناء:"
    echo "🔍 Last 20 lines from build log:"
    tail -20 build.log
    exit 1
fi