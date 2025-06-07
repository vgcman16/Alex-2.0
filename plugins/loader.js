const { readdirSync } = require('fs');
const { join } = require('path');

/**
 * Load all plugin modules from a directory and invoke their `activate`
 * functions if present.
 *
 * @param {string} dir Directory containing plugin modules
 * @param {object} [context] Optional context passed to each plugin
 * @returns {object[]} Array of loaded plugin modules
 */
function loadPlugins(dir, context = {}) {
  const modules = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.js')) continue;
    const mod = require(join(dir, file));
    if (typeof mod.activate === 'function') {
      mod.activate(context);
    }
    modules.push(mod);
  }
  return modules;
}

module.exports = { loadPlugins };
