#!/bin/bash

# Quick setup script for WASL platform
# This script sets up both the browser agent and Gemma.cpp AI system

set -e

echo "========================================"
echo "مرحبا بك في منصة وسل - WASL Platform"
echo "========================================"
echo "Setting up integrated platform components..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check for browser agent
if [ -d "khalid-agent" ]; then
    print_success "Browser agent (Khalid) found"
else
    print_warning "Browser agent not found in khalid-agent/"
fi

# Check for Gemma.cpp
if [ -d "gemma" ]; then
    print_success "Gemma.cpp AI system found"
else
    print_error "Gemma.cpp not found. This script needs the gemma/ directory."
    exit 1
fi

# Check system requirements for Gemma.cpp
print_status "Checking system requirements for AI system..."

if command -v cmake &> /dev/null; then
    print_success "CMake found: $(cmake --version | head -1)"
else
    print_error "CMake not found. Please install CMake first:"
    echo "  Ubuntu/Debian: sudo apt install cmake"
    echo "  macOS: brew install cmake"
    exit 1
fi

if command -v g++ &> /dev/null; then
    print_success "G++ compiler found: $(g++ --version | head -1)"
else
    print_error "G++ compiler not found. Please install build tools:"
    echo "  Ubuntu/Debian: sudo apt install build-essential"
    echo "  macOS: xcode-select --install"
    exit 1
fi

# Build Gemma.cpp
print_status "Building Gemma.cpp AI system..."
cd gemma

if [ -f "scripts/build.sh" ]; then
    ./scripts/build.sh
    if [ $? -eq 0 ]; then
        print_success "Gemma.cpp built successfully"
    else
        print_error "Failed to build Gemma.cpp"
        exit 1
    fi
else
    print_error "Build script not found"
    exit 1
fi

# Run tests
print_status "Running tests..."
if [ -f "scripts/test.sh" ]; then
    ./scripts/test.sh
    if [ $? -eq 0 ]; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed, but continuing..."
    fi
fi

cd ..

# Setup complete
echo ""
echo "========================================"
print_success "WASL Platform Setup Complete!"
echo "========================================"
echo ""
echo "Available components:"
echo ""
echo "1. 🤖 Browser Agent (Khalid):"
echo "   - Location: khalid-agent/"
echo "   - Install: Load as Chrome extension"
echo ""
echo "2. 🧠 AI System (Gemma.cpp):"
echo "   - Location: gemma/"
echo "   - CLI: ./gemma/build/bin/gemma_cli"
echo "   - Help: ./gemma/build/bin/gemma_cli --help"
echo ""
echo "Quick AI test:"
echo "  ./gemma/build/bin/gemma_cli --prompt \"مرحبا!\""
echo ""
echo "Interactive AI mode:"
echo "  ./gemma/build/bin/gemma_cli --interactive"
echo ""
echo "For detailed documentation:"
echo "  - Main README: README.md"
echo "  - AI System: gemma/README.md"
echo ""
print_success "Ready to use! 🚀"