const { writeFileSync, mkdirSync } = require('fs');
const { dirname, join } = require('path');
const { spawnSync } = require('child_process');

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, encoding: 'utf-8' });
  if (res.status !== 0) {
    throw new Error(res.stderr || `Command failed: ${cmd} ${args.join(' ')}`);
  }
  return res.stdout.trim();
}

/**
 * Apply file modifications and commit them on a new git branch.
 *
 * @param {Object} options
 * @param {string} options.repo Path to git repository
 * @param {Object<string,string>} options.files Mapping of file paths to new content
 * @param {string} [options.branch] Branch name to create
 * @param {(cmd:string,args:string[],cwd:string)=>string} [options.exec] Custom exec function
 * @returns {string} name of created branch
 */
function editFiles({ repo = '.', files, branch, exec = run } = {}) {
  if (!files || Object.keys(files).length === 0) {
    throw new Error('files is required');
  }
  branch = branch || `feature-${Date.now()}`;
  exec('git', ['checkout', '-b', branch], repo);

  for (const [p, content] of Object.entries(files)) {
    const full = join(repo, p);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
    exec('git', ['add', p], repo);
  }

  exec('git', ['commit', '-m', 'Update files'], repo);
  return branch;
}

module.exports = { editFiles };
