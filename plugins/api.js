const commands = {};

function resetCommands() {
  for (const key of Object.keys(commands)) {
    delete commands[key];
  }
}

function registerCommand(name, fn) {
  if (typeof name !== 'string' || typeof fn !== 'function') {
    throw new Error('registerCommand(name, fn)');
  }
  commands[name] = fn;
}

function runCommand(name, ...args) {
  const cmd = commands[name];
  if (!cmd) throw new Error(`Command ${name} not found`);
  return cmd(...args);
}

module.exports = { registerCommand, runCommand, resetCommands };
