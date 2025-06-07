const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { loadPlugins } = require('../../plugins/loader');

describe('loadPlugins', () => {
  it('calls activate on each plugin', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'plugins-'));
    fs.writeFileSync(
      join(dir, 'a.js'),
      'module.exports.activate = ctx => { ctx.a = true; };'
    );
    const context = {};
    loadPlugins(dir, context);
    expect(context.a).to.equal(true);
  });

  it('loads modules without activate', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'plugins-'));
    fs.writeFileSync(join(dir, 'b.js'), 'module.exports = { name: "b" };');
    const context = {};
    const mods = loadPlugins(dir, context);
    expect(mods).to.have.length(1);
    expect(mods[0].name).to.equal('b');
  });
});
