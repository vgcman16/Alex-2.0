const { expect } = require('chai');
const { runChat } = require('../../app/chat');
const { setModel } = require('../../app/model');

function mockStream(chunks) {
  return (async function* () {
    for (const c of chunks) {
      yield { choices: [{ delta: { content: c } }] };
    }
  })();
}

describe('runChat', () => {
  it('streams tokens from OpenRouter', async () => {
    process.env.OPENROUTER_API_KEY = 'test';
    const received = [];
    await runChat([{ role: 'user', content: 'hi' }], (t) => received.push(t), {
      streamChatCompletion: () => mockStream(['a', 'b']),
    });
    expect(received.join('')).to.equal('ab');
  });

  it('throws when API key missing and no local model', async () => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.LLAMA_PATH;
    delete process.env.LLAMA_MODEL;
    let err;
    try {
      await runChat([], () => {}, {
        streamChatCompletion: () => mockStream([]),
      });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('OPENROUTER_API_KEY is not set');
  });

  it('falls back to local model when API key missing', async () => {
    delete process.env.OPENROUTER_API_KEY;
    process.env.LLAMA_PATH = '/bin/llama';
    process.env.LLAMA_MODEL = 'model.gguf';
    const received = [];
    await runChat([{ role: 'user', content: 'hi' }], (t) => received.push(t), {
      runLlama: async () => 'local',
    });
    expect(received.join('')).to.equal('local');
  });

  it('uses selected model for OpenRouter', async () => {
    process.env.OPENROUTER_API_KEY = 'test';
    setModel('my-model');
    let used;
    await runChat([{ role: 'user', content: 'hi' }], () => {}, {
      streamChatCompletion: ({ models }) => {
        used = models[0];
        return mockStream([]);
      },
    });
    expect(used).to.equal('my-model');
  });
});
