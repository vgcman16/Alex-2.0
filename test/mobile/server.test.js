const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const request = require('supertest');
const { createServer } = require('../../mobile/server');

describe('mobile server', () => {
  let file;
  beforeEach(() => {
    file = join(fs.mkdtempSync(join(os.tmpdir(), 'mobile-')), 'mem.json');
    fs.writeFileSync(file, '[]');
  });

  it('returns memory contents', async () => {
    fs.writeFileSync(file, '[1]');
    const app = createServer({ memoryFile: file, runChat: async () => {} });
    const res = await request(app).get('/memory');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([1]);
  });

  it('appends chat entries', async () => {
    const app = createServer({
      memoryFile: file,
      runChat: async (_msgs, onToken) => {
        onToken('hi');
      },
    });
    const res = await request(app).post('/chat').send({ message: 'hello' });
    expect(res.status).to.equal(200);
    expect(res.body.response).to.equal('hi');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(data).to.deep.equal([
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'hi' },
    ]);
  });

  it('syncs memory when syncUrl provided', async () => {
    let urlArg;
    const app = createServer({
      memoryFile: file,
      runChat: async (_m, t) => t('x'),
      syncUrl: 'https://remote',
      syncFn: async (url, f) => {
        urlArg = `${url}|${f}`;
      },
    });
    await request(app).post('/chat').send({ message: 'hi' });
    expect(urlArg).to.equal(`https://remote|${file}`);
  });

  it('validates chat input', async () => {
    const app = createServer({ memoryFile: file, runChat: async () => {} });
    const res = await request(app).post('/chat').send({});
    expect(res.status).to.equal(400);
  });

  it('serves static index', async () => {
    const app = createServer({ memoryFile: file, runChat: async () => {} });
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('<!doctype html>');
  });

  it('clears memory via DELETE', async () => {
    fs.writeFileSync(file, '[1]');
    const app = createServer({ memoryFile: file, runChat: async () => {} });
    const res = await request(app).delete('/memory');
    expect(res.status).to.equal(200);
    const data = fs.readFileSync(file, 'utf8');
    expect(data).to.equal('[]');
  });
});
