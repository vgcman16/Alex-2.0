const { expect } = require('chai');
const { summarize } = require('../../plugins/summarizer');

function mockStream(chunks) {
  return (async function* () {
    for (const c of chunks) {
      yield { choices: [{ delta: { content: c } }] };
    }
  })();
}

describe('summarizer plugin', () => {
  afterEach(() => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.LLAMA_PATH;
    delete process.env.LLAMA_MODEL;
  });

  it('summarizes using OpenRouter', async () => {
    process.env.OPENROUTER_API_KEY = 'key';
    const text = await summarize('hello world', {
      streamChatCompletion: () => mockStream(['sum']),
      getModel: () => 'm',
    });
    expect(text).to.equal('sum');
  });

  it('falls back to local model when API key missing', async () => {
    process.env.LLAMA_PATH = '/bin/llama';
    process.env.LLAMA_MODEL = 'm.gguf';
    const text = await summarize('hi', {
      runLlama: async () => 'local',
    });
    expect(text).to.equal('local');
  });

  it('throws when no model configured', async () => {
    let err;
    try {
      await summarize('foo', {
        streamChatCompletion: () => mockStream([]),
      });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('OPENROUTER_API_KEY is not set');
  });
});
