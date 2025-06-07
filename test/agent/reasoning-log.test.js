const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { createLogger } = require('../../agent/reasoning-log');

describe('reasoning log', () => {
  it('appends messages to log file', () => {
    const file = join(os.tmpdir(), `log-${Date.now()}`);
    const { log } = createLogger({ file, prompt: async () => 'n' });
    log('step 1');
    log('step 2');
    const content = fs.readFileSync(file, 'utf8').trim();
    expect(content).to.equal('step 1\nstep 2');
  });

  it('returns true when approved', async () => {
    const file = join(os.tmpdir(), `log-${Date.now()}`);
    let asked = '';
    const prompt = async (q) => {
      asked = q;
      return 'y';
    };
    const { log, approve } = createLogger({ file, prompt });
    log('do it');
    const ok = await approve();
    expect(asked).to.match(/Apply changes/);
    expect(ok).to.equal(true);
  });

  it('returns false when rejected', async () => {
    const file = join(os.tmpdir(), `log-${Date.now()}`);
    const { log, approve } = createLogger({ file, prompt: async () => 'n' });
    log('no');
    const ok = await approve();
    expect(ok).to.equal(false);
  });
});
