# App

This directory contains the core application code. The module `yjs-webrtc.js`
initializes a Yjs document and connects to a public WebRTC signaling server. The
`monaco-shared.js` helper creates a Monaco editor instance bound to that shared
Yjs document.

## Manual Test

Install dependencies and run the manual sync test:

```bash
npm install
npm test
```

The test creates two peers in the same process. Text inserted on one peer is
synced to the other peer via WebRTC. Remote cursor positions appear with the
peer's name and a unique colour.
