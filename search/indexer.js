const { readdirSync, readFileSync, statSync } = require('fs');
const { join, extname } = require('path');

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      files = files.concat(walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

/**
 * Build a simple word index for all files under a directory.
 * @param {string} dir directory to index
 * @param {object} [opts]
 * @param {string[]} [opts.exts=['.js']]
 * @returns {Map<string, Array<{file:string,line:number,text:string}>>}
 */
function createIndex(dir, { exts = ['.js'] } = {}) {
  const index = new Map();
  for (const file of walk(dir)) {
    if (!exts.includes(extname(file))) continue;
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const words = line.toLowerCase().match(/[a-zA-Z_][\w]*/g);
      if (!words) return;
      for (const w of words) {
        if (!index.has(w)) index.set(w, []);
        index.get(w).push({ file, line: i + 1, text: line });
      }
    });
  }
  return index;
}

function search(index, word) {
  if (!word) return [];
  return index.get(word.toLowerCase()) || [];
}

module.exports = { createIndex, search };
