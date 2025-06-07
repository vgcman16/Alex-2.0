const { spawn } = require('child_process');

function openShell({
  cwd = '.',
  shell = process.env.SHELL,
  args = [],
  spawnImpl = spawn,
} = {}) {
  if (!shell) shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
  return spawnImpl(shell, args, { cwd, stdio: 'inherit', shell: false });
}

module.exports = { openShell };
