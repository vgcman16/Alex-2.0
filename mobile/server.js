const express = require('express');
const { load, append } = require('../ai-service/memory-store');
const { runChat } = require('../app/chat');

function createServer({
  runChat: chatImpl = runChat,
  memoryFile = 'memory.json',
} = {}) {
  const app = express();
  app.use(express.json());

  app.get('/memory', (req, res) => {
    res.json(load(memoryFile));
  });

  app.post('/chat', async (req, res) => {
    const message = req.body && req.body.message;
    if (!message) {
      res.status(400).json({ error: 'message required' });
      return;
    }
    const messages = [{ role: 'user', content: message }];
    let responseText = '';
    try {
      await chatImpl(messages, (tok) => (responseText += tok));
      append({ role: 'user', content: message }, memoryFile);
      append({ role: 'assistant', content: responseText }, memoryFile);
      res.json({ response: responseText });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}

module.exports = { createServer };
