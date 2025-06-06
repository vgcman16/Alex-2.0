# Alex 2.0

## Project Overview

Alex 2.0 is a simple project used for demonstration purposes. This repository contains minimal code and is intended primarily for educational exercises in version control and basic development workflows.

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Change into the project directory and install any dependencies if required.

## Architecture

The current structure is intentionally lightweight. It includes only a README file, but you can expand it with your own scripts or additional resources. Feel free to adapt the layout to suit your needs.

## Real-time Editing Demo

The `app` folder now contains a small module for initializing a [Yjs](https://yjs.dev/) document using the WebRTC provider. A helper binds the shared document to the Monaco editor.

Run a manual sync test to see two peers share text data:

```bash
npm install
npm test
```

The test script spawns two Node processes that connect to the public signaling server. One inserts text and the other prints the synchronized content.

## Contributing

Contributions are welcome! Fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Please keep your commits concise and provide clear descriptions of your changes.


## License

This project is licensed under the [MIT License](LICENSE).
