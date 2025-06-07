const { spawn } = require('child_process');

function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    let out = '';
    child.stdout.on('data', (d) => {
      out += d.toString();
    });
    child.stderr.on('data', (d) => {
      out += d.toString();
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`llama exited with code ${code}`));
    });
  });
}

/**
 * Run a prompt using a local llama.cpp binary.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {object} [options]
 * @param {string} [options.executable] Path to the llama binary (`LLAMA_PATH` by default).
 * @param {string} [options.model] Path to the GGUF weights file (`LLAMA_MODEL` by default).
 * @param {Function} [options.runCmd] Custom command runner for testing.
 * @returns {Promise<string>} Resolves with the generated completion text.
 */
async function runLlama(prompt, options = {}) {
  const exe = options.executable || process.env.LLAMA_PATH;
  const model = options.model || process.env.LLAMA_MODEL;
  const runner = options.runCmd || runCommand;
  const gpuLayers =
    options.gpuLayers || process.env.LLAMA_GPU_LAYERS || null;
  if (!exe) throw new Error('LLAMA_PATH is not set');
  if (!model) throw new Error('LLAMA_MODEL is not set');
  const args = ['-m', model, '-p', prompt, '--silent-prompt'];
  if (gpuLayers) {
    args.push('--n-gpu-layers', String(gpuLayers));
  }
  return runner(exe, args);
}

module.exports = { runLlama };
