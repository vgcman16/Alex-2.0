const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const https = require('https');

function loadRegistry(file = join(__dirname, 'marketplace.json')) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function list(file) {
  return Object.keys(loadRegistry(file));
}

function defaultDownload(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function install(
  name,
  { marketplaceFile, dir = __dirname, download = defaultDownload } = {}
) {
  const registry = loadRegistry(marketplaceFile);
  const url = registry[name];
  if (!url) throw new Error(`Unknown plugin: ${name}`);
  const code = await download(url);
  writeFileSync(join(dir, `${name}.js`), code);
}

module.exports = { list, install };
