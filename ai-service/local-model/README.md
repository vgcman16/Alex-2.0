# Local Model Setup

This folder contains simple build scripts for [llama.cpp](https://github.com/ggerganov/llama.cpp).

## Building llama.cpp

- `build_cpu.sh` builds llama.cpp for CPU usage only.
- `build_gpu.sh` builds llama.cpp with CUDA support.

Run the appropriate script from this directory:

```bash
./build_cpu.sh    # CPU build
./build_gpu.sh    # GPU build with CUDA
```

The scripts clone the `llama.cpp` repository if it is not already present and then compile the project.

## Downloading GGUF Models

Create a `models` directory to store your models. GGUF files can be downloaded from providers such as Hugging Face. Example:

```bash
mkdir -p models
wget https://example.com/path/to/model.gguf -O models/model.gguf
```

## Sample Manifest

You can describe model locations and parameters in a `manifest.json` file:

```json
{
  "models": [
    {
      "name": "llama-7b",
      "path": "models/llama-7b.Q4_K_M.gguf",
      "context_length": 4096,
      "threads": 8,
      "gpu_layers": 35
    }
  ]
}
```

- `path` points to the GGUF model file.
- `context_length` is the maximum number of tokens in the context window.
- `threads` defines how many CPU threads to use.
- `gpu_layers` sets how many layers will be offloaded to the GPU (set to `0` for CPU-only).
