const { expect } = require('chai');
const { fetchCompletion } = require('../../app/autocomplete');

function mockStream(chunks) {
  return (async function* () {
    for (const c of chunks) {
      yield { choices: [{ delta: { content: c } }] };
    }
  })();
}

describe('fetchCompletion', () => {
  it('concatenates streamed chunks', async () => {
    process.env.OPENROUTER_API_KEY = 'test';
    const result = await fetchCompletion('foo', {
      streamChatCompletion: () => mockStream(['bar', ' baz'])
    });
    expect(result).to.equal('bar baz');
  });

  it('throws when API key missing', async () => {
    delete process.env.OPENROUTER_API_KEY;
    let err;
    try {
      await fetchCompletion('foo', { streamChatCompletion: () => mockStream([]) });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('OPENROUTER_API_KEY is not set');
  });
});
