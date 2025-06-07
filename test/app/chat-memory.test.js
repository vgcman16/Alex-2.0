const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { runChatWithMemory } = require('../../app/chat-memory');

function mockChat(output) {
  return async (_msgs, onToken) => {
    onToken(output);
  };
}

describe('runChatWithMemory', () => {
  it('stores messages and syncs when configured', async () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'mem-'));
    const file = join(dir, 'memory.json');
    fs.writeFileSync(file, '[]');
    let syncArg;
    await runChatWithMemory([
      { role: 'user', content: 'hi' }
    ], () => {}, {
      memoryFile: file,
      syncUrl: 'https://remote',
      runChat: mockChat('ok'),
      syncFn: async (url, f) => { syncArg = `${url}|${f}`; },
    });
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(data).to.deep.equal([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'ok' },
    ]);
    expect(syncArg).to.equal(`https://remote|${file}`);
  });
});
