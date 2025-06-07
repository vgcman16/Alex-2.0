const { spawnSync } = require('child_process');

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, encoding: 'utf-8' });
  if (res.status !== 0) {
    throw new Error(res.stderr || `Command failed: ${cmd} ${args.join(' ')}`);
  }
  return res.stdout.trim();
}

/**
 * Push current branch and create a pull request using the GitHub CLI.
 *
 * @param {Object} options
 * @param {string} [options.repo='.'] Working directory of the repository
 * @param {string} options.title Pull request title
 * @param {string} [options.body] Pull request body
 * @param {string} [options.base='main'] Base branch
 * @param {(cmd:string,args:string[],cwd:string)=>string} [options.exec] Custom exec function
 * @returns {string} stdout from the `gh pr create` command
 */
function createPullRequest({ repo = '.', title, body = '', base = 'main', exec = run } = {}) {
  if (!title) throw new Error('title is required');
  const branch = exec('git', ['rev-parse', '--abbrev-ref', 'HEAD'], repo);
  exec('git', ['push', '--set-upstream', 'origin', branch], repo);
  return exec('gh', ['pr', 'create', '--title', title, '--body', body, '--base', base], repo);
}

module.exports = { createPullRequest };
