const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { loadPlugins } = require('../../plugins/loader');
const api = require('../../plugins/api');

describe('plugin api', () => {
  afterEach(() => api.resetCommands());

  it('registers commands from plugin', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'plug-'));
    fs.writeFileSync(
      join(dir, 'p.js'),
      'module.exports.activate = ({registerCommand}) => registerCommand("hi", () => "ok");'
    );
    loadPlugins(dir, api);
    const result = api.runCommand('hi');
    expect(result).to.equal('ok');
  });
});
