#!/bin/bash

# مثال بسيط لاستخدام Gemma.cpp
# Simple Gemma.cpp usage example

echo "🤖 مرحباً بك في Gemma.cpp - محرك الذكاء الاصطناعي المحلي"
echo "🤖 Welcome to Gemma.cpp - Local AI Engine"
echo ""

# التحقق من وجود ملفات النموذج
if [ ! -f "tokenizer.spm" ] || [ ! -f "*.sbs" 2>/dev/null ]; then
    echo "⚠️  ملفات النموذج غير موجودة!"
    echo "⚠️  Model files not found!"
    echo ""
    echo "📥 لتحميل النماذج:"
    echo "📥 To download models:"
    echo "   1. اذهب إلى: https://www.kaggle.com/models/google/gemma-2/gemmaCpp"
    echo "   1. Go to: https://www.kaggle.com/models/google/gemma-2/gemmaCpp"
    echo "   2. حمّل gemma2-2b-it-sfp"
    echo "   2. Download gemma2-2b-it-sfp"
    echo "   3. استخرج الملفات هنا"
    echo "   3. Extract files here"
    exit 1
fi

# البحث عن ملف النموذج
MODEL_FILE=$(ls *.sbs 2>/dev/null | head -1)

if [ -z "$MODEL_FILE" ]; then
    echo "❌ لم يتم العثور على ملف النموذج (.sbs)"
    echo "❌ Model file (.sbs) not found"
    exit 1
fi

echo "✅ تم العثور على النموذج: $MODEL_FILE"
echo "✅ Found model: $MODEL_FILE"
echo ""

# تشغيل Gemma مع النص التفاعلي
echo "🚀 بدء تشغيل Gemma..."
echo "🚀 Starting Gemma..."
echo ""
echo "💡 أمثلة للأسئلة:"
echo "💡 Example questions:"
echo "   - ما هو الذكاء الاصطناعي؟"
echo "   - اشرح لي البرمجة"
echo "   - اكتب قصة قصيرة"
echo ""

# تشغيل Gemma
./gemma --tokenizer tokenizer.spm --weights "$MODEL_FILE"