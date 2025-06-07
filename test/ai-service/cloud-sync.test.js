const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { uploadMemory, downloadMemory, syncMemory } = require('../../ai-service/cloud-sync');

const originalFetch = global.fetch;

describe('cloud sync', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('uploads file contents via PUT', async () => {
    const file = join(fs.mkdtempSync(join(os.tmpdir(), 'sync-')), 'mem.json');
    fs.writeFileSync(file, '[1,2]');

    let called = false;
    global.fetch = async (url, opts) => {
      called = true;
      expect(opts.method).to.equal('PUT');
      expect(opts.body).to.equal('[1,2]');
      return new Response('', { status: 200 });
    };

    await uploadMemory('https://example.com/mem', file);
    expect(called).to.equal(true);
  });

  it('downloads remote data to file', async () => {
    const file = join(fs.mkdtempSync(join(os.tmpdir(), 'sync-')), 'mem.json');
    global.fetch = async () => new Response('["a"]', { status: 200 });
    await downloadMemory('https://example.com/mem', file);
    expect(fs.readFileSync(file, 'utf8')).to.equal('["a"]');
  });

  it('merges remote and local data', async () => {
    const file = join(fs.mkdtempSync(join(os.tmpdir(), 'sync-')), 'mem.json');
    fs.writeFileSync(file, JSON.stringify([{ msg: 'a' }, { msg: 'c' }], null, 2));

    const calls = [];
    global.fetch = async (url, opts) => {
      calls.push(opts && opts.method);
      if (!opts) {
        return new Response(JSON.stringify([{ msg: 'a' }, { msg: 'b' }]), { status: 200 });
      }
      expect(opts.method).to.equal('PUT');
      const data = JSON.parse(opts.body);
      expect(data).to.deep.equal([{ msg: 'a' }, { msg: 'c' }, { msg: 'b' }]);
      return new Response('', { status: 200 });
    };

    await syncMemory('https://example.com/mem', file);
    const result = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(result).to.deep.equal([{ msg: 'a' }, { msg: 'c' }, { msg: 'b' }]);
    expect(calls).to.deep.equal([undefined, 'PUT']);
  });
});
