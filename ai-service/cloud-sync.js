const { readFile, writeFile } = require('fs/promises');

/**
 * Upload the contents of a local memory file to a remote URL.
 *
 * @param {string} url - Destination URL for the upload.
 * @param {string} [file='memory.json'] - Path to the local memory file.
 * @param {Function} [fetchFn=fetch] - Custom fetch implementation for testing.
 * @returns {Promise<void>}
 */
async function uploadMemory(url, file = 'memory.json', fetchFn = fetch) {
  const body = await readFile(file, 'utf8').catch(() => '[]');
  const res = await fetchFn(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
}

/**
 * Download memory data from a remote URL and overwrite the local file.
 *
 * @param {string} url - Source URL to download from.
 * @param {string} [file='memory.json'] - Path to the local memory file.
 * @param {Function} [fetchFn=fetch] - Custom fetch implementation for testing.
 * @returns {Promise<void>}
 */
async function downloadMemory(url, file = 'memory.json', fetchFn = fetch) {
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const text = await res.text();
  await writeFile(file, text);
}

/**
 * Synchronise the local memory file with the remote source and destination.
 * Merges unique entries from both sides and uploads the combined result.
 *
 * @param {string} url - Remote URL to sync with.
 * @param {string} [file='memory.json'] - Path to the local memory file.
 * @param {Function} [fetchFn=fetch] - Custom fetch implementation for testing.
 * @returns {Promise<void>}
 */
async function syncMemory(url, file = 'memory.json', fetchFn = fetch) {
  const local = JSON.parse(await readFile(file, 'utf8').catch(() => '[]'));
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const remote = JSON.parse(await res.text());
  const merged = [...local];
  for (const item of remote) {
    if (!merged.some(e => JSON.stringify(e) === JSON.stringify(item))) {
      merged.push(item);
    }
  }
  await writeFile(file, JSON.stringify(merged, null, 2));
  const uploadRes = await fetchFn(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(merged, null, 2),
  });
  if (!uploadRes.ok) {
    throw new Error(`HTTP ${uploadRes.status}`);
  }
}

module.exports = { uploadMemory, downloadMemory, syncMemory };
