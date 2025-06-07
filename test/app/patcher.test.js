const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const diff = require('diff');
const { previewPatch, applyPatch } = require('../../app/patcher');

describe('patcher', () => {
  it('previews and applies patch', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'patch-'));
    const file = join(dir, 'a.txt');
    fs.writeFileSync(file, 'hello\n');
    const patch = diff.createTwoFilesPatch('a.txt', 'a.txt', 'hello\n', 'hi\n');
    const res = previewPatch(patch, dir);
    expect(res.file).to.equal(file);
    expect(res.patched).to.equal('hi\n');
    applyPatch(patch, dir);
    const updated = fs.readFileSync(file, 'utf8');
    expect(updated).to.equal('hi\n');
  });

  it('creates parent directory when applying patch', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'patch-'));
    const subFile = join(dir, 'sub', 'b.txt');
    const patch = diff.createTwoFilesPatch('sub/b.txt', 'sub/b.txt', '', 'hi\n');
    applyPatch(patch, dir);
    const updated = fs.readFileSync(subFile, 'utf8');
    expect(updated).to.equal('hi\n');
  });
});
