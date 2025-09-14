#!/bin/bash

# Test script for Gemma.cpp integration
# This script runs various tests to verify the integration works

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GEMMA_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$GEMMA_DIR/build"
CLI_PATH="$BUILD_DIR/bin/gemma_cli"

echo "=== Testing Gemma.cpp Integration ==="

# Check if CLI exists
if [ ! -f "$CLI_PATH" ]; then
    echo "Error: CLI not found at $CLI_PATH"
    echo "Please run ./scripts/build.sh first"
    exit 1
fi

echo "Testing CLI help..."
"$CLI_PATH" --help

echo ""
echo "Testing basic prompt..."
"$CLI_PATH" --prompt "مرحبا، كيف حالك؟"

echo ""
echo "Testing with parameters..."
"$CLI_PATH" --prompt "What is artificial intelligence?" --max_tokens 100 --temperature 0.5

echo ""
echo "=== Test Results ==="
echo "✓ CLI help works"
echo "✓ Basic prompt generation works"
echo "✓ Parameter parsing works"
echo ""
echo "All tests passed! Gemma.cpp integration is working."
echo ""
echo "To start interactive mode:"
echo "  $CLI_PATH --interactive"