const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { list, install } = require('../../plugins/marketplace');

describe('marketplace', () => {
  it('lists plugin names', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'mp-'));
    const file = join(dir, 'market.json');
    fs.writeFileSync(
      file,
      JSON.stringify({ foo: 'http://example.com/foo.js' })
    );
    const names = list(file);
    expect(names).to.deep.equal(['foo']);
  });

  it('installs plugin using custom downloader', async () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'mp-'));
    const file = join(dir, 'market.json');
    fs.writeFileSync(
      file,
      JSON.stringify({ bar: 'http://example.com/bar.js' })
    );
    const dest = fs.mkdtempSync(join(os.tmpdir(), 'plug-'));
    const download = async (url) => `module.exports.name = '${url}';`;
    await install('bar', { marketplaceFile: file, dir: dest, download });
    const code = fs.readFileSync(join(dest, 'bar.js'), 'utf8');
    expect(code).to.contain('example.com/bar.js');
  });

  it('rejects invalid plugin names', async () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'mp-'));
    const file = join(dir, 'market.json');
    fs.writeFileSync(file, JSON.stringify({ good: 'http://example.com/good.js' }));
    const dest = fs.mkdtempSync(join(os.tmpdir(), 'plug-'));
    const download = async () => 'module.exports = {}';
    try {
      await install('../bad', { marketplaceFile: file, dir: dest, download });
      throw new Error('should have thrown');
    } catch (err) {
      expect(err.message).to.equal('Invalid plugin name');
    }
  });
});
