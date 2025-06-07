const fs = require('fs');
const readline = require('readline');

function defaultPrompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function createLogger({ file = 'reasoning.log', prompt = defaultPrompt } = {}) {
  function log(message) {
    fs.appendFileSync(file, message + '\n');
  }

  async function approve() {
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const answer = await prompt(`${content}\nApply changes? (y/N) `);
    return /^y(es)?$/i.test(answer.trim());
  }

  return { log, approve };
}

module.exports = { createLogger };
