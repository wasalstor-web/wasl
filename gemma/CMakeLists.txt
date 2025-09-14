cmake_minimum_required(VERSION 3.16)
project(gemma_cpp VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add compilation flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -Wall -Wextra")

# Find required packages
find_package(Threads REQUIRED)

# Include directories
include_directories(include)

# Create gemma library
add_library(gemma_lib
    src/gemma.cpp
)

target_include_directories(gemma_lib PUBLIC include)
target_link_libraries(gemma_lib Threads::Threads)

# Create main executable
add_executable(gemma_cli src/main.cpp)
target_link_libraries(gemma_cli gemma_lib)

# Set output directory
set_target_properties(gemma_cli PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)

# Installation rules
install(TARGETS gemma_cli
    RUNTIME DESTINATION bin
)

install(TARGETS gemma_lib
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)

install(DIRECTORY include/
    DESTINATION include
    FILES_MATCHING PATTERN "*.h"
)

# Create models directory
file(MAKE_DIRECTORY ${CMAKE_BINARY_DIR}/models)

# Add custom target for creating example model files
add_custom_target(demo_models
    COMMAND ${CMAKE_COMMAND} -E echo "Demo model file for testing" > ${CMAKE_BINARY_DIR}/models/demo.bin
    COMMAND ${CMAKE_COMMAND} -E echo "Demo tokenizer file for testing" > ${CMAKE_BINARY_DIR}/models/tokenizer.bin
    COMMENT "Creating demo model files"
)

# Print build information
message(STATUS "Gemma.cpp integration for WASL")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ compiler: ${CMAKE_CXX_COMPILER}")
message(STATUS "C++ flags: ${CMAKE_CXX_FLAGS}")