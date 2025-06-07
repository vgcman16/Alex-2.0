const { expect } = require('chai');
const { runLlama } = require('../../ai-service/llama');

function stubRunner(output, code = 0, capture) {
  return async (cmd, args) => {
    if (code !== 0) throw new Error(`llama exited with code ${code}`);
    if (capture) capture(args);
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

  it('passes gpu layers option', async () => {
    process.env.LLAMA_PATH = '/bin/llama';
    process.env.LLAMA_MODEL = 'model.gguf';
    process.env.LLAMA_GPU_LAYERS = '2';
    let args;
    await runLlama('Hi', {
      runCmd: stubRunner('ok', 0, (a) => {
        args = a;
      }),
    });
    expect(args).to.include('--n-gpu-layers');
    const idx = args.indexOf('--n-gpu-layers');
    expect(args[idx + 1]).to.equal('2');
  });
});
