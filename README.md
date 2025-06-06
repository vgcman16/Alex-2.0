# Alex 2.0

## Project Overview

Alex 2.0 is a simple project used for demonstration purposes. This repository contains minimal code and is intended primarily for educational exercises in version control and basic development workflows.

## Getting Started

1. Clone the repository and change into its directory:
   ```bash
   git clone https://github.com/vgcman16/Alex-2.0.git
   cd Alex-2.0
   ```
2. Install any dependencies (if required):
   ```bash
   pip install -r requirements.txt
   ```

3. To run the desktop application located in the `app` folder:
   ```bash
   cd app
   npm install
   npm start
   ```

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
