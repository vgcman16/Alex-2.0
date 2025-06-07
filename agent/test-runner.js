const { spawnSync } = require('child_process');

function run(cmd, args, cwd) {
  return spawnSync(cmd, args, { cwd, stdio: 'inherit', encoding: 'utf-8' });
}

/**
 * Run `npm test` with optional retries until it succeeds.
 *
 * @param {Object} options
 * @param {string} [options.repo='.'] Working directory of the repository
 * @param {number} [options.retries=0] Number of times to retry on failure
 * @param {(cmd:string,args:string[],cwd:string)=>{status:number}} [options.exec] Custom exec function
 */
function runTests({ repo = '.', retries = 0, exec = run } = {}) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt++;
    const res = exec('npm', ['test'], repo);
    if (res.status === 0) return;
    if (attempt > retries) {
      throw new Error('Tests failed');
    }
  }
}

module.exports = { runTests };
