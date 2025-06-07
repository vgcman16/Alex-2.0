const { expect } = require('chai');
const { review } = require('../../agent/code-reviewer');

function mockStream(text) {
  return (async function* () {
    yield { choices: [{ delta: { content: text } }] };
  })();
}

describe('review', () => {
  it('returns comments from each reviewer', async () => {
    process.env.OPENROUTER_API_KEY = 'key';
    const reviewers = [
      { name: 'A', prompt: 'a' },
      { name: 'B', prompt: 'b' },
    ];
    const result = await review('diff', {
      reviewers,
      streamChatCompletion: () => mockStream('ok'),
    });
    expect(result).to.deep.equal([
      { reviewer: 'A', comment: 'ok' },
      { reviewer: 'B', comment: 'ok' },
    ]);
  });

  it('throws when API key missing', async () => {
    delete process.env.OPENROUTER_API_KEY;
    let err;
    try {
      await review('diff', { streamChatCompletion: () => mockStream('') });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('OPENROUTER_API_KEY is not set');
  });

  it('throws when diff missing', async () => {
    process.env.OPENROUTER_API_KEY = 'key';
    let err;
    try {
      await review('', { streamChatCompletion: () => mockStream('') });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('diff is required');
  });
});
