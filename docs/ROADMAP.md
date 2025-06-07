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
   - Autonomous agent to run tasks and create PRs ✅
   - Cost dashboard with OpenRouter headers ✅
   - Real-time collaboration via Yjs ✅
   - Test runner loop and built-in shell
   - Reasoning log with approval step before edits
   - Context-aware chat with code search
3. **v1.0 (12 wks)**
   - Local model runner integration ✅
   - Extension marketplace and plugin API ✅
   - Persistent memory store ✅
   - Windows NSIS installer and winget manifest
   - Status-bar model switcher with routing rules
   - Opt-in telemetry via OpenTelemetry
   - Long-term project wiki memory
   - Security hardening and self-host option
4. **v1.1+**
   - Voice coding ✅
   - Multi-agent code review ✅
   - UI tests ✅
5. **v2.0 (16 wks)**
   - Cloud sync across devices ✅
   - Mobile companion app ✅
   - ChatOps CLI for automation ✅
   - Code search indexing ✅
   - GPU-accelerated local inference ✅

## Next Steps

- 3-pane layout with diff viewer and one-click patch apply
- Light and dark themes with modern icons
- Model flexibility via status bar switcher
- Windows installer auto-update and winget manifest
- Telemetry dashboard and cost tracking
- Sample extension and model plugin
- Architecture diagram and contribution guide
- Demo GIFs and screenshots of core flows
- Continued polish of the mobile UI
- Packaging and installers for each platform
- Enhanced GPU offloading options
