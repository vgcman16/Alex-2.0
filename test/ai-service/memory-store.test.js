const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { load, append, reset } = require('../../ai-service/memory-store');

describe('memory store', () => {
  let file;
  beforeEach(() => {
    file = join(fs.mkdtempSync(join(os.tmpdir(), 'mem-')), 'mem.json');
  });

  it('returns empty array when file missing', () => {
    expect(load(file)).to.deep.equal([]);
  });

  it('appends entries and persists them', () => {
    append({ msg: 'a' }, file);
    append({ msg: 'b' }, file);
    expect(load(file)).to.deep.equal([{ msg: 'a' }, { msg: 'b' }]);
  });

  it('resets the file', () => {
    append({ msg: 'a' }, file);
    reset(file);
    expect(load(file)).to.deep.equal([]);
  });
});
