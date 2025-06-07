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

The codebase is intentionally lightweight. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a high-level diagram of how the pieces interact. You can extend the structure with your own scripts or additional resources.

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
export LLAMA_GPU_LAYERS=35 # optional
```

The `runLlama` helper in `ai-service/llama.js` executes the binary and returns the generated text.
If `OPENROUTER_API_KEY` is unset and these variables are provided, the app automatically falls back to the local runner.

## Model Switcher

The desktop app shows a model selector in the status bar. By default the dropdown
contains `gpt-3.5` and `gpt-4`. Set the `MODEL_OPTIONS` environment variable to a
comma-separated list of identifiers to customise the available options. The first
model becomes the default.

```bash
export MODEL_OPTIONS="openrouter/openai/gpt-3.5-turbo,openrouter/openai/gpt-4,openrouter/mistralai/mistral-7b"
```

## Voice Coding

Alex 2.0 can capture speech and insert the transcribed text directly into the editor.
The `createVoiceCoder` function in `app/voice.js` wraps the browser's
`SpeechRecognition` API. Pass the active Monaco editor to
`createVoiceCoder(editor)` and call `start()` to begin dictation. Call `stop()`
to end the session. Spoken words appear at the current cursor position.

## Cost Dashboard

Each OpenRouter request can include `usage` tracking to report token counts and cost.
The `cost-dashboard` module aggregates these usage objects and exposes the total
credits consumed during a session.

## Telemetry Dashboard

Use `telemetry-dashboard.js` to log events across the app. Call
`recordEvent(type, data)` to store an event with a timestamp. When the `type` is
`"usage"`, the event is also recorded by the cost dashboard so total spending is
tracked automatically. Retrieve the list with `getEvents()` or aggregate counts
with `getEventCounts()`.

## Persistent Memory Store

Use `memory-store.js` to persist conversation history between sessions. The
module provides `append(entry, file)` to record messages, `load(file)` to read
them back, and `reset(file)` to clear the store.

## Multi-agent Code Review

The `review` function in `agent/code-reviewer.js` coordinates multiple AI
reviewers. Pass a diff to `review(diff)` and receive comments from each
configured reviewer. The default reviewers include a senior developer and a
security expert.

## ChatOps CLI

Automate common tasks using the `chatops` command line tool.

Plan a goal:

```bash
node cli/chatops.js plan "add feature"
```

Synchronise the memory store with a remote URL:

```bash
node cli/chatops.js sync https://example.com/memory.json path/to/memory.json
```

Upload the local memory file without merging:

```bash
node cli/chatops.js upload https://example.com/memory.json path/to/memory.json
```

Download the remote memory file:

```bash
node cli/chatops.js download https://example.com/memory.json path/to/memory.json
```

Start a background watcher to periodically sync:

```bash
node cli/chatops.js watch https://example.com/memory.json path/to/memory.json
```

Search code for a word:

```bash
node cli/chatops.js search TODO src
```

## Cloud Sync Watcher

Automatically keep your memory file in sync across devices. Use
`startSyncWatcher(url, opts)` from `ai-service/sync-watcher.js` to periodically
merge and upload changes:

```javascript
const { startSyncWatcher } = require('./ai-service/sync-watcher');

const watcher = startSyncWatcher('https://example.com/memory.json', {
  interval: 30000,
  file: 'path/to/memory.json',
});
// Call watcher.stop() to disable syncing
```

Set `MEMORY_FILE` to the path of a local JSON file and `MEMORY_SYNC_URL` to a
remote `/memory` endpoint to have the desktop app automatically store and sync
chat history after each message.

## Contributing

Contributions are welcome! Fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Please keep your commits concise and provide clear descriptions of your changes. For more details, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

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
