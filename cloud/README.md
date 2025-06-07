# Cloud Memory Server

This simple Express server stores conversation memory for cloud sync.

It exposes a single `/memory` endpoint:

- `GET /memory` returns the stored JSON array
- `PUT /memory` replaces the stored data with the provided JSON array
- `DELETE /memory` clears the stored data

Start the server:

```bash
node cloud/index.js
```
