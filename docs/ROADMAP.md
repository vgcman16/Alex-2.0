# Roadmap

This document outlines the proposed plan for developing the AI IDE.

## Tech Stack
- **Electron** for desktop shell
- **Monaco Editor** for code editing
- **Node.js** backend (v18+)
- **OpenRouter API** for hosted models
- **Llama.cpp** for local models
- **Yjs** and **WebRTC** for real-time collaboration
- **Docker** and **GitHub Actions** for CI/CD

## Milestones
1. **MVP (4 wks)**
   - Electron window with Monaco editor ✅
   - Basic in-editor chat using OpenRouter completions ✅
   - Inline autocomplete ✅
   - Dev container and CI pipeline ✅
2. **Beta (8 wks)**
   - Autonomous agent to run tasks and create PRs
   - Cost dashboard with OpenRouter headers ✅
   - Real-time collaboration via Yjs
3. **v1.0 (12 wks)**
   - Local model runner integration
   - Extension marketplace and plugin API
   - Persistent memory store
4. **v1.1+**
   - Voice coding
   - Multi-agent code review
   - UI tests
5. **v2.0 (16 wks)**
   - Cloud sync across devices
   - Mobile companion app
   - ChatOps CLI for automation
   - Code search indexing
   - GPU-accelerated local inference
