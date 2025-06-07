# Mobile Companion Server

This directory contains a minimal HTTP API intended for the mobile companion app.
It exposes three routes:

- `GET /memory` – returns the stored conversation history.
- `POST /chat` – sends a chat message and returns the assistant response.
- `DELETE /memory` – clears the stored conversation history.

The server also serves a small web interface from `/` that you can open in a
mobile browser to view the history and send messages.

Run the server:

```bash
node mobile/index.js
```
