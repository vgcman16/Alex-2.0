const express = require('express');
const { load, append } = require('../ai-service/memory-store');
const { runChat } = require('../app/chat');
const { syncMemory } = require('../ai-service/cloud-sync');

const { join } = require('path');

function createServer({
  runChat: chatImpl = runChat,
  memoryFile = 'memory.json',
  staticDir = join(__dirname, 'public'),
  syncUrl,
  syncFn = syncMemory,
} = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(staticDir));

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
      if (syncUrl) {
        try {
          await syncFn(syncUrl, memoryFile);
        } catch (err) {
          console.error('sync error:', err.message);
        }
      }
      res.json({ response: responseText });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}

module.exports = { createServer };
