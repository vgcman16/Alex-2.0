const fs = require('fs');
const { join, dirname } = require('path');
const diff = require('diff');

function fileFromPatch(p) {
  const name = p.newFileName && p.newFileName !== '/dev/null' ? p.newFileName : p.oldFileName;
  return name.replace(/^a\//, '').replace(/^b\//, '');
}

function previewPatch(patchText, repo = '.') {
  const patches = diff.parsePatch(patchText);
  if (patches.length === 0) throw new Error('Invalid patch');
  const patch = patches[0];
  const file = join(repo, fileFromPatch(patch));
  let original = '';
  if (fs.existsSync(file)) original = fs.readFileSync(file, 'utf8');
  const patched = diff.applyPatch(original, patch);
  if (patched === false) throw new Error('Failed to apply patch');
  return { file, original, patched };
}

function applyPatch(patchText, repo = '.') {
  const { file, patched } = previewPatch(patchText, repo);
  fs.mkdirSync(dirname(file), { recursive: true });
  fs.writeFileSync(file, patched, 'utf8');
}

module.exports = { previewPatch, applyPatch };
