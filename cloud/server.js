const express = require('express');
const fs = require('fs');

function createServer({ memoryFile = 'memory.json' } = {}) {
  const app = express();
  app.use(express.json());

  app.get('/memory', (req, res) => {
    let data = '[]';
    if (fs.existsSync(memoryFile)) {
      data = fs.readFileSync(memoryFile, 'utf8');
    }
    res.type('json').send(data);
  });

  app.put('/memory', (req, res) => {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ error: 'invalid data' });
      return;
    }
    fs.writeFileSync(memoryFile, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  });

  app.delete('/memory', (req, res) => {
    fs.writeFileSync(memoryFile, '[]');
    res.json({ ok: true });
  });

  return app;
}

module.exports = { createServer };
