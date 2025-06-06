FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:18

# Install Git LFS for repositories that track large files
RUN apt-get update \
    && apt-get install -y --no-install-recommends git-lfs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

