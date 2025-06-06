const { streamChatCompletion } = require('../../ai-service/openrouter');
const { ReadableStream } = require('node:stream/web');
const { expect } = require('chai');

// Preserve the original fetch implementation so it can be restored after tests
const originalFetch = global.fetch;

describe('streamChatCompletion', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });
  function streamFromChunks(chunks) {
    return new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      }
    });
  }

  it('falls back to next model and yields parsed chunks', async () => {
    let call = 0;
    const messages = [{ role: 'user', content: 'hi' }];
    const chunks = [
      'data: {"choices":[{"delta":{"content":"foo"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"bar"}}]}\n\n',
      'data: [DONE]\n\n'
    ];

    global.fetch = async (url, opts) => {
      call++;
      const body = JSON.parse(opts.body);
      if (call === 1) {
        return new Response(null, { status: 500 });
      }
      expect(body.model).to.equal('model-b');
      return new Response(streamFromChunks(chunks), { status: 200 });
    };

    const deltas = [];
    for await (const delta of streamChatCompletion({
      messages,
      models: ['model-a', 'model-b'],
      apiKey: 'test-key'
    })) {
      deltas.push(delta);
    }

    expect(call).to.equal(2);
    expect(deltas).to.deep.equal([
      { choices: [{ delta: { content: 'foo' } }] },
      { choices: [{ delta: { content: 'bar' } }] }
    ]);
  });

  it('throws when apiKey is missing', async () => {
    let error;
    try {
      for await (const _ of streamChatCompletion({
        messages: [],
        models: ['model-a'],
        apiKey: undefined
      })) {
        // no-op
      }
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal('OPENROUTER_API_KEY is required');
  });
});
