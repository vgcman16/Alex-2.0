const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const request = require('supertest');
const { createServer } = require('../../cloud/server');

describe('cloud memory server', () => {
  let file;
  beforeEach(() => {
    file = join(fs.mkdtempSync(join(os.tmpdir(), 'cloud-')), 'mem.json');
    fs.writeFileSync(file, '[]');
  });

  it('returns stored memory', async () => {
    fs.writeFileSync(file, '[{"msg":"a"}]');
    const app = createServer({ memoryFile: file });
    const res = await request(app).get('/memory');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('[{"msg":"a"}]');
  });

  it('replaces memory via PUT', async () => {
    const app = createServer({ memoryFile: file });
    const res = await request(app)
      .put('/memory')
      .send([{ msg: 'b' }]);
    expect(res.status).to.equal(200);
    const data = fs.readFileSync(file, 'utf8');
    expect(JSON.parse(data)).to.deep.equal([{ msg: 'b' }]);
  });

  it('validates PUT body', async () => {
    const app = createServer({ memoryFile: file });
    const res = await request(app).put('/memory').send({});
    expect(res.status).to.equal(400);
  });

  it('clears memory via DELETE', async () => {
    fs.writeFileSync(file, '[{"a":1}]');
    const app = createServer({ memoryFile: file });
    const res = await request(app).delete('/memory');
    expect(res.status).to.equal(200);
    const data = fs.readFileSync(file, 'utf8');
    expect(data).to.equal('[]');
  });
});
