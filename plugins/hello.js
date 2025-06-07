function activate({ registerCommand }) {
  registerCommand('hello', () => 'Hello from plugin!');
}

module.exports = { activate };
