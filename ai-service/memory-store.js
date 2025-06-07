const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { dirname } = require('path');

/**
 * Load persisted memory from a JSON file.
 * @param {string} [file='memory.json'] Path to the JSON file.
 * @returns {object[]} Array of stored entries.
 */
function load(file = 'memory.json') {
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

/**
 * Append an entry to the memory file.
 * @param {object} entry Entry to persist.
 * @param {string} [file='memory.json'] Path to the JSON file.
 */
function append(entry, file = 'memory.json') {
  mkdirSync(dirname(file), { recursive: true });
  const data = load(file);
  data.push(entry);
  writeFileSync(file, JSON.stringify(data, null, 2));
}

/**
 * Clear all entries from the memory file.
 * @param {string} [file='memory.json'] Path to the JSON file.
 */
function reset(file = 'memory.json') {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, '[]');
}

module.exports = { load, append, reset };
