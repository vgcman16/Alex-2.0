# Mobile Companion Server

This directory contains a minimal HTTP API intended for the mobile companion app.
It exposes two routes:

- `GET /memory` – returns the stored conversation history.
- `POST /chat` – sends a chat message and returns the assistant response.

Run the server:

```bash
node mobile/index.js
```
