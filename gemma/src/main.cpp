// Copyright 2024 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "gemma.h"
#include <iostream>
#include <string>
#include <vector>
#include <cstring>

void PrintUsage(const char* program_name) {
    std::cout << "Usage: " << program_name << " [OPTIONS]\n";
    std::cout << "\nOptions:\n";
    std::cout << "  --model PATH          Path to the Gemma model file\n";
    std::cout << "  --tokenizer PATH      Path to the tokenizer file\n";
    std::cout << "  --prompt TEXT         Text prompt for generation\n";
    std::cout << "  --max_tokens NUM      Maximum tokens to generate (default: 256)\n";
    std::cout << "  --temperature FLOAT   Temperature for generation (default: 0.7)\n";
    std::cout << "  --interactive         Start interactive mode\n";
    std::cout << "  --help                Show this help message\n";
    std::cout << "\nExample:\n";
    std::cout << "  " << program_name << " --model models/gemma-2b.bin --prompt \"Hello, world!\"\n";
    std::cout << "\nNote: This is a simplified implementation for demonstration.\n";
    std::cout << "For production use, download actual Gemma models from Google.\n";
}

int main(int argc, char* argv[]) {
    std::string model_path;
    std::string tokenizer_path;
    std::string prompt;
    int max_tokens = 256;
    float temperature = 0.7f;
    bool interactive = false;
    bool help = false;

    // Parse command line arguments
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--model") == 0 && i + 1 < argc) {
            model_path = argv[++i];
        } else if (strcmp(argv[i], "--tokenizer") == 0 && i + 1 < argc) {
            tokenizer_path = argv[++i];
        } else if (strcmp(argv[i], "--prompt") == 0 && i + 1 < argc) {
            prompt = argv[++i];
        } else if (strcmp(argv[i], "--max_tokens") == 0 && i + 1 < argc) {
            max_tokens = std::stoi(argv[++i]);
        } else if (strcmp(argv[i], "--temperature") == 0 && i + 1 < argc) {
            temperature = std::stof(argv[++i]);
        } else if (strcmp(argv[i], "--interactive") == 0) {
            interactive = true;
        } else if (strcmp(argv[i], "--help") == 0) {
            help = true;
        } else {
            std::cerr << "Unknown argument: " << argv[i] << std::endl;
            PrintUsage(argv[0]);
            return 1;
        }
    }

    if (help) {
        PrintUsage(argv[0]);
        return 0;
    }

    std::cout << "=== Gemma.cpp Integration for WASL ===" << std::endl;
    std::cout << "Google Gemma Local Inference Engine" << std::endl;
    std::cout << "=====================================" << std::endl;

    // Initialize model and tokenizer
    gemma::Model model;
    gemma::Tokenizer tokenizer;

    // Load model if specified
    if (!model_path.empty()) {
        std::cout << "Loading model from: " << model_path << std::endl;
        if (!model.LoadModel(model_path)) {
            std::cerr << "Failed to load model from: " << model_path << std::endl;
            std::cerr << "Note: This demo uses simplified model loading." << std::endl;
            std::cerr << "For real usage, download Gemma models from Google." << std::endl;
            return 1;
        }
    } else {
        std::cout << "Warning: No model specified. Using demo mode." << std::endl;
        // Create a dummy model file for demo
        model_path = "models/demo.bin";
        model.LoadModel(model_path);
    }

    // Load tokenizer if specified
    if (!tokenizer_path.empty()) {
        std::cout << "Loading tokenizer from: " << tokenizer_path << std::endl;
        if (!tokenizer.Load(tokenizer_path)) {
            std::cerr << "Failed to load tokenizer" << std::endl;
        }
    }

    if (interactive) {
        std::cout << "\n=== Interactive Mode ===" << std::endl;
        std::cout << "Enter prompts (type 'quit' to exit):" << std::endl;
        
        std::string line;
        while (true) {
            std::cout << "\n> ";
            std::getline(std::cin, line);
            
            if (line == "quit" || line == "exit") {
                break;
            }
            
            if (line.empty()) {
                continue;
            }
            
            std::cout << "\nGenerating response..." << std::endl;
            std::string response = model.Generate(line, max_tokens, temperature);
            std::cout << "\nResponse:\n" << response << std::endl;
        }
    } else if (!prompt.empty()) {
        std::cout << "\nPrompt: " << prompt << std::endl;
        std::cout << "Generating response..." << std::endl;
        
        std::string response = model.Generate(prompt, max_tokens, temperature);
        std::cout << "\nResponse:\n" << response << std::endl;
    } else {
        std::cout << "\nNo prompt specified. Use --prompt or --interactive mode." << std::endl;
        PrintUsage(argv[0]);
        return 1;
    }

    return 0;
}