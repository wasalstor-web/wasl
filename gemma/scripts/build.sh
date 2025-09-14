#!/bin/bash

# Build script for Gemma.cpp integration
# This script builds the Gemma C++ library and CLI tool

set -e

echo "=== Building Gemma.cpp for WASL ==="

# Check if cmake is available
if ! command -v cmake &> /dev/null; then
    echo "Error: cmake is not installed"
    echo "Please install cmake first:"
    echo "  Ubuntu/Debian: sudo apt install cmake"
    echo "  macOS: brew install cmake"
    exit 1
fi

# Check if g++ is available
if ! command -v g++ &> /dev/null; then
    echo "Error: g++ is not installed"
    echo "Please install g++ first:"
    echo "  Ubuntu/Debian: sudo apt install build-essential"
    echo "  macOS: xcode-select --install"
    exit 1
fi

# Create build directory
BUILD_DIR="build"
if [ -d "$BUILD_DIR" ]; then
    echo "Cleaning existing build directory..."
    rm -rf "$BUILD_DIR"
fi

mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

echo "Configuring project..."
cmake ..

echo "Building project..."
make -j$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)

echo "Creating demo models..."
make demo_models

echo ""
echo "=== Build Complete ==="
echo "Executable: $(pwd)/bin/gemma_cli"
echo ""
echo "To test the CLI:"
echo "  ./bin/gemma_cli --help"
echo "  ./bin/gemma_cli --prompt \"Hello, world!\""
echo "  ./bin/gemma_cli --interactive"
echo ""
echo "Note: This is a simplified implementation for demonstration."
echo "For production use, download actual Gemma models from Google."