const { expect } = require('chai');
const { runLlama } = require('../../ai-service/llama');

function stubRunner(output, code = 0) {
  return async () => {
    if (code !== 0) throw new Error(`llama exited with code ${code}`);
    return output;
  };
}

describe('runLlama', () => {
  it('returns output from command', async () => {
    process.env.LLAMA_PATH = '/bin/llama';
    process.env.LLAMA_MODEL = 'model.gguf';
    const result = await runLlama('Hi', { runCmd: stubRunner('Hello') });
    expect(result).to.equal('Hello');
  });

  it('throws when LLAMA_PATH missing', async () => {
    delete process.env.LLAMA_PATH;
    process.env.LLAMA_MODEL = 'model.gguf';
    let err;
    try {
      await runLlama('Hi', { runCmd: stubRunner('') });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('LLAMA_PATH is not set');
  });
});
