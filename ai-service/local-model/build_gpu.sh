#!/bin/bash
set -e

# Build llama.cpp with CUDA GPU acceleration
if [ ! -d llama.cpp ]; then
  git clone https://github.com/ggerganov/llama.cpp.git
fi
cd llama.cpp
make clean
make LLAMA_CUBLAS=1
