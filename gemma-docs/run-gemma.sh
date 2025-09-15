#!/bin/bash
# Gemma.cpp Simple Execution Script | سكريبت تشغيل Gemma.cpp البسيط
# Author: WASL Project | مشروع وسل

# Configuration | الإعدادات
MODEL_PATH="${MODEL_PATH:-./models/2b-it-sfp.sbs}"
TOKENIZER_PATH="${TOKENIZER_PATH:-./models/tokenizer.spm}"
PROMPT="${PROMPT:-Hello, how are you today?}"
MODEL_TYPE="${MODEL_TYPE:-2b-it}"
GEMMA_EXECUTABLE="${GEMMA_EXECUTABLE:-./build/gemma}"

# Colors for output | ألوان المخرجات
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages | دالة طباعة الرسائل الملونة
print_message() {
    local color=$1
    local message_en=$2
    local message_ar=$3
    echo -e "${color}[EN]${NC} $message_en"
    echo -e "${color}[AR]${NC} $message_ar"
    echo
}

# Function to check if file exists | دالة فحص وجود الملف
check_file() {
    local file=$1
    local description_en=$2
    local description_ar=$3
    
    if [[ ! -f "$file" ]]; then
        print_message $RED \
            "Error: $description_en not found at: $file" \
            "خطأ: $description_ar غير موجود في: $file"
        return 1
    fi
    return 0
}

# Print banner | طباعة اللافتة
echo -e "${BLUE}"
echo "=================================================="
echo "  Gemma.cpp Runner for WASL Project"
echo "  مشغل Gemma.cpp لمشروع وسل"
echo "=================================================="
echo -e "${NC}"

# Validate prerequisites | التحقق من المتطلبات
print_message $YELLOW \
    "Checking prerequisites..." \
    "جاري فحص المتطلبات..."

# Check if Gemma executable exists
check_file "$GEMMA_EXECUTABLE" \
    "Gemma executable" \
    "ملف Gemma التنفيذي" || {
    print_message $RED \
        "Please build Gemma first using: cmake -B build && cd build && make" \
        "يرجى بناء Gemma أولاً باستخدام: cmake -B build && cd build && make"
    exit 1
}

# Check if model file exists
check_file "$MODEL_PATH" \
    "Model weights file" \
    "ملف أوزان النموذج" || {
    print_message $RED \
        "Please download and extract model files to ./models/ directory" \
        "يرجى تنزيل واستخراج ملفات النموذج إلى مجلد ./models/"
    print_message $YELLOW \
        "See INSTALL.md for detailed instructions" \
        "راجع INSTALL.md للحصول على تعليمات مفصلة"
    exit 1
}

# Check if tokenizer exists
check_file "$TOKENIZER_PATH" \
    "Tokenizer file" \
    "ملف المُحَلِّل الرمزي" || {
    print_message $RED \
        "Please ensure tokenizer.spm is in the models directory" \
        "يرجى التأكد من وجود tokenizer.spm في مجلد النماذج"
    exit 1
}

# Display configuration | عرض الإعدادات
print_message $GREEN \
    "Configuration:" \
    "الإعدادات:"

echo -e "  ${BLUE}Model Path:${NC} $MODEL_PATH"
echo -e "  ${BLUE}Tokenizer:${NC} $TOKENIZER_PATH"
echo -e "  ${BLUE}Model Type:${NC} $MODEL_TYPE"
echo -e "  ${BLUE}Prompt:${NC} $PROMPT"
echo

# Run Gemma | تشغيل Gemma
print_message $GREEN \
    "Starting Gemma inference..." \
    "جاري بدء استنتاج Gemma..."

echo -e "${YELLOW}Command:${NC} $GEMMA_EXECUTABLE --tokenizer \"$TOKENIZER_PATH\" --compressed_weights \"$MODEL_PATH\" --model \"$MODEL_TYPE\""
echo
echo -e "${GREEN}Output:${NC}"
echo "----------------------------------------"

# Execute Gemma with the prompt
echo "$PROMPT" | "$GEMMA_EXECUTABLE" \
    --tokenizer "$TOKENIZER_PATH" \
    --compressed_weights "$MODEL_PATH" \
    --model "$MODEL_TYPE"

# Check exit status
if [[ $? -eq 0 ]]; then
    echo
    echo "----------------------------------------"
    print_message $GREEN \
        "Gemma execution completed successfully!" \
        "تم تشغيل Gemma بنجاح!"
else
    echo
    echo "----------------------------------------"
    print_message $RED \
        "Gemma execution failed. Check the error messages above." \
        "فشل تشغيل Gemma. تحقق من رسائل الخطأ أعلاه."
    exit 1
fi

# Usage examples | أمثلة الاستخدام
print_message $BLUE \
    "Usage examples:" \
    "أمثلة الاستخدام:"

echo -e "  ${YELLOW}Custom prompt:${NC}"
echo "  PROMPT=\"What is artificial intelligence?\" ./run-gemma.sh"
echo
echo -e "  ${YELLOW}Different model:${NC}"
echo "  MODEL_PATH=\"./models/9b-it-sfp.sbs\" MODEL_TYPE=\"9b-it\" ./run-gemma.sh"
echo
echo -e "  ${YELLOW}Arabic prompt:${NC}"
echo "  PROMPT=\"ما هو الذكاء الاصطناعي؟\" ./run-gemma.sh"
echo