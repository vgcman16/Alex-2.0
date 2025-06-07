# Alex 2.0

## Project Overview

Alex 2.0 is a simple project used for demonstration purposes. This repository contains minimal code and is intended primarily for educational exercises in version control and basic development workflows.

## Getting Started

Make sure you have **Node.js v18 or higher** installed. Node 18+ is required,
and the `ws` package provides a WebSocket polyfill (loaded in
`app/yjs-webrtc.js`) so the WebRTC examples work in a non-browser environment.

1. Clone the repository and change into its directory:
   ```bash
   git clone https://github.com/vgcman16/Alex-2.0.git
   cd Alex-2.0
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```

3. To run the desktop application located in the `app` folder:
   ```bash
   cd app
   npm install
   npm start
   ```

## Setup Checklist

Use this list to verify that your environment is ready:

- [x] Node.js v18 or higher is installed
- [x] Repository cloned locally
- [x] `npm install` completed at the project root
- [x] Dependencies installed in `app` (`cd app && npm install`)
- [ ] Desktop app started with `npm start` inside `app`
- [ ] `OPENROUTER_API_KEY` exported if using AI service

## Development Container

The project includes a `.devcontainer` configuration for VS Code and GitHub Codespaces.
Opening the repository in a container automatically installs dependencies using
the `postCreateCommand` defined in `devcontainer.json`, providing a ready-to-use
Node 18 environment with Git LFS installed.

## Running Tests

This project uses [Mocha](https://mochajs.org/) for its test suite. Mocha is
installed along with the other dependencies, so make sure to run `npm install`
before invoking the test command.

To install all dependencies and run the tests in one step:

```bash
npm install && npm test
```

You can also run the commands individually if preferred.

## Architecture

The current structure is intentionally lightweight. It includes only a README file, but you can expand it with your own scripts or additional resources. Feel free to adapt the layout to suit your needs.

## Real-time Editing Demo

The `app` folder now contains a small module for initializing a [Yjs](https://yjs.dev/) document using the WebRTC provider. A helper binds the shared document to the Monaco editor and exposes remote cursor presence.

Run a manual sync test to see two peers share text data:

```bash
npm install
npm test
```

`npm install` installs Mocha and other dependencies required for the tests.

The test script spawns two Node processes that connect to the public signaling server. One inserts text and the other prints the synchronized content.

Press `Ctrl+Space` in the editor to request an inline completion from the OpenRouter API. The suggestion appears directly at the cursor location.

## Local Model Runner

Alex 2.0 can also generate completions offline using [`llama.cpp`](https://github.com/ggerganov/llama.cpp). Set the `LLAMA_PATH` environment variable to the compiled binary and `LLAMA_MODEL` to your GGUF weights file.

```bash
export LLAMA_PATH=/path/to/main
export LLAMA_MODEL=/path/to/model.gguf
```

The `runLlama` helper in `ai-service/llama.js` executes the binary and returns the generated text.
If `OPENROUTER_API_KEY` is unset and these variables are provided, the app automatically falls back to the local runner.

## Cost Dashboard

Each OpenRouter request can include `usage` tracking to report token counts and cost.
The `cost-dashboard` module aggregates these usage objects and exposes the total
credits consumed during a session.

## Persistent Memory Store

Use `memory-store.js` to persist conversation history between sessions. The
module provides `append(entry, file)` to record messages, `load(file)` to read
them back, and `reset(file)` to clear the store.

## Contributing

Contributions are welcome! Fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Please keep your commits concise and provide clear descriptions of your changes.

## Working with Binary Files

Some assets may use [Git LFS](https://git-lfs.com/). If you contribute or modify binary files, install LFS locally:

```bash
git lfs install
```

You can obtain LFS content when cloning:

```bash
git lfs clone <repository-url>
```

Or clone normally and pull LFS objects afterwards:

```bash
git clone <repository-url>
git lfs pull
```


## License

This project is licensed under the [MIT License](LICENSE).
