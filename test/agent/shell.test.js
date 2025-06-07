const { expect } = require('chai');
const { openShell } = require('../../agent/shell');

describe('openShell', () => {
  it('spawns provided shell with args and options', () => {
    let called;
    const spawnImpl = (cmd, args, opts) => {
      called = { cmd, args, opts };
      return { pid: 1 };
    };
    const child = openShell({
      cwd: '/tmp',
      shell: '/bin/zsh',
      args: ['-l'],
      spawnImpl,
    });
    expect(called).to.deep.equal({
      cmd: '/bin/zsh',
      args: ['-l'],
      opts: { cwd: '/tmp', stdio: 'inherit', shell: false },
    });
    expect(child.pid).to.equal(1);
  });

  it('falls back to default shell', () => {
    let cmd;
    const spawnImpl = (c) => {
      cmd = c;
      return {};
    };
    delete process.env.SHELL;
    const expected = process.platform === 'win32' ? 'cmd.exe' : 'bash';
    openShell({ spawnImpl });
    expect(cmd).to.equal(expected);
  });
});
