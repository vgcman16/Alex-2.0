const https = require('https');
const { exec } = require('child_process');
const { version: currentVersion } = require('../package.json');

function parseVersion(v) {
  return v.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
}

function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

function fetchLatestRelease(repo) {
  const opts = {
    hostname: 'api.github.com',
    path: `/repos/${repo}/releases/latest`,
    headers: { 'User-Agent': 'alex-updater' },
  };
  return new Promise((resolve, reject) => {
    https
      .get(opts, (res) => {
        let data = '';
        res.on('data', (d) => (data += d));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
          } else {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          }
        });
      })
      .on('error', reject);
  });
}

function defaultDownload(url) {
  if (process.platform === 'win32') {
    exec(`start "" "${url}"`);
  } else {
    console.log(`Update available: ${url}`);
  }
}

async function checkForUpdates({
  repo = 'vgcman16/Alex-2.0',
  version = currentVersion,
  getRelease = fetchLatestRelease,
  download = defaultDownload,
} = {}) {
  const release = await getRelease(repo);
  const latest = release.tag_name.replace(/^v/, '');
  if (compareVersions(latest, version) <= 0) return false;
  const asset = release.assets.find((a) => a.name.endsWith('.exe'));
  if (asset) download(asset.browser_download_url);
  return true;
}

module.exports = { checkForUpdates, compareVersions, fetchLatestRelease };
