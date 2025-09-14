// Example usage of Gemma.cpp library
// This file demonstrates how to use the Gemma API directly

#include "gemma.h"
#include <iostream>

int main() {
    std::cout << "=== Gemma.cpp Library Usage Example ===" << std::endl;
    
    // Create model and tokenizer instances
    gemma::Model model;
    gemma::Tokenizer tokenizer;
    
    // Load model (in demo mode)
    std::cout << "\nLoading model..." << std::endl;
    if (!model.LoadModel("demo.bin")) {
        std::cerr << "Failed to load model" << std::endl;
        return 1;
    }
    
    // Check model status
    if (model.IsLoaded()) {
        std::cout << "✓ Model loaded successfully" << std::endl;
        
        // Get model configuration
        const auto& config = model.GetConfig();
        std::cout << "Model config:" << std::endl;
        std::cout << "  Vocab size: " << config.vocab_size << std::endl;
        std::cout << "  Sequence length: " << config.seq_len << std::endl;
        std::cout << "  Model dimension: " << config.model_dim << std::endl;
    }
    
    // Generate text examples
    std::vector<std::string> prompts = {
        "Hello, how are you?",
        "مرحبا، كيف حالك؟",
        "What is artificial intelligence?",
        "Explain machine learning in simple terms"
    };
    
    std::cout << "\n=== Text Generation Examples ===" << std::endl;
    
    for (const auto& prompt : prompts) {
        std::cout << "\nPrompt: " << prompt << std::endl;
        std::cout << "Response: " << model.Generate(prompt, 100, 0.7f) << std::endl;
        std::cout << "---" << std::endl;
    }
    
    // Tokenizer example
    std::cout << "\n=== Tokenizer Example ===" << std::endl;
    
    std::string text = "Hello world!";
    auto tokens = tokenizer.Encode(text);
    std::string decoded = tokenizer.Decode(tokens);
    
    std::cout << "Original text: " << text << std::endl;
    std::cout << "Tokens: ";
    for (size_t i = 0; i < tokens.size(); ++i) {
        std::cout << tokens[i];
        if (i < tokens.size() - 1) std::cout << ", ";
    }
    std::cout << std::endl;
    std::cout << "Decoded text: " << decoded << std::endl;
    std::cout << "Vocabulary size: " << tokenizer.VocabSize() << std::endl;
    
    std::cout << "\n=== Example Complete ===" << std::endl;
    
    return 0;
}