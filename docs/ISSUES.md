# Issue Breakdown

This file lists proposed epics and issues for delivering the AI IDE.

## Epic: MVP
- **Issue: Electron Shell** ✅
  - Create basic Electron window loading `index.html`.
  - Acceptance: App starts on Windows and macOS.
- **Issue: Monaco Editor Integration** ✅
  - Add Monaco editor instance in renderer.
  - Acceptance: Editor displays and supports basic editing.
- **Issue: OpenRouter Autocomplete** ✅
  - Implement streamed completions using `streamChatCompletion`.
  - Acceptance: Pressing Ctrl+Space triggers completions from API.
- **Issue: Dev Container & CI** ✅
  - Provide Dockerfile and GitHub Actions workflow.
  - Acceptance: CI installs dependencies and runs tests.

## Epic: Autonomous Agent
- **Issue: Task Planner** ✅
  - Accept user goal and produce step-by-step plan.
  - Acceptance: Plan printed to log.
- **Issue: File Editor**
  - Agent can modify multiple files and create branch.
  - Acceptance: Changes committed on feature branch.
- **Issue: Test Runner Loop**
  - Run `npm test` and retry on failure.
  - Acceptance: Tests pass before PR is created.

## Epic: Collaboration
- **Issue: Yjs Sync**
  - Connect multiple peers using WebRTC provider.
  - Acceptance: Text edits propagate between two windows.
- **Issue: Presence Cursors**
  - Display remote cursor positions.
  - Acceptance: See name/colour of remote user.

## Epic: Local Models
- **Issue: Llama.cpp Integration**
  - Bundle GGUF weights and `llama.cpp` binaries.
  - Acceptance: Autocomplete works offline.

