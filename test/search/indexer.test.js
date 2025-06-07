const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { createIndex, search } = require('../../search/indexer');

describe('code search indexer', () => {
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(join(os.tmpdir(), 'idx-'));
    fs.writeFileSync(join(dir, 'a.js'), 'function foo() {}');
    fs.writeFileSync(join(dir, 'b.js'), 'const bar = foo();');
    fs.writeFileSync(join(dir, 'note.txt'), 'foo bar');
  });

  it('indexes js files by default', () => {
    const idx = createIndex(dir);
    const results = search(idx, 'foo');
    expect(results.length).to.equal(2);
    expect(results[0].file).to.match(/a.js|b.js/);
  });

  it('supports extension filter', () => {
    const idx = createIndex(dir, { exts: ['.js', '.txt'] });
    const res = search(idx, 'bar');
    expect(res.length).to.equal(2);
  });

  it('returns empty array for missing term', () => {
    const idx = createIndex(dir);
    expect(search(idx, 'missing')).to.deep.equal([]);
  });
});
