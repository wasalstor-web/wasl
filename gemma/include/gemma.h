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

#ifndef GEMMA_H_
#define GEMMA_H_

#include <string>
#include <vector>
#include <memory>

namespace gemma {

// Model configuration structure
struct ModelConfig {
    size_t vocab_size = 256000;
    size_t seq_len = 8192;
    size_t model_dim = 3072;
    size_t hidden_dim = 24576;
    size_t num_layers = 28;
    size_t num_heads = 16;
    size_t num_kv_heads = 16;
    float head_dim = 256.0f;
};

// Forward declaration
class ModelImpl;

// Main Gemma model class
class Model {
public:
    Model();
    ~Model();

    // Load model from file
    bool LoadModel(const std::string& model_path);
    
    // Generate text from prompt
    std::string Generate(const std::string& prompt, 
                        size_t max_tokens = 256,
                        float temperature = 0.7f);
    
    // Check if model is loaded
    bool IsLoaded() const;
    
    // Get model configuration
    const ModelConfig& GetConfig() const;

private:
    std::unique_ptr<ModelImpl> impl_;
};

// Tokenizer class
class Tokenizer {
public:
    Tokenizer();
    ~Tokenizer();
    
    // Load tokenizer from file
    bool Load(const std::string& tokenizer_path);
    
    // Encode text to tokens
    std::vector<int> Encode(const std::string& text);
    
    // Decode tokens to text
    std::string Decode(const std::vector<int>& tokens);
    
    // Get vocabulary size
    size_t VocabSize() const;

private:
    class TokenizerImpl;
    std::unique_ptr<TokenizerImpl> impl_;
};

} // namespace gemma

#endif // GEMMA_H_