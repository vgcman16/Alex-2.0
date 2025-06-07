const { runChatWithMemory } = require('./chat-memory');
const { createVoiceCoder } = require('./voice');
const { startSyncWatcher } = require('../ai-service/sync-watcher');

function setupUI(
  doc,
  editor,
  {
    runChat: chatImpl = runChatWithMemory,
    createVoiceCoder: voiceCtor = createVoiceCoder,
    startSyncWatcher: watcherCtor = startSyncWatcher,
  } = {}
) {
  let watcher;
  if (process.env.MEMORY_SYNC_URL && watcherCtor) {
    watcher = watcherCtor(process.env.MEMORY_SYNC_URL, {
      file: process.env.MEMORY_FILE,
    });
    if (doc.defaultView) {
      doc.defaultView.addEventListener('beforeunload', () => watcher.stop());
    }
  }
  let voice;
  doc.getElementById('voice-btn').onclick = () => {
    if (!voice) {
      try {
        voice = voiceCtor(editor);
        voice.start();
        doc.getElementById('voice-btn').textContent = 'Stop';
      } catch (err) {
        if (typeof alert !== 'undefined') alert(err.message);
      }
    } else {
      voice.stop();
      voice = null;
      doc.getElementById('voice-btn').textContent = 'Voice';
    }
  };

  doc.getElementById('chat-send').onclick = async () => {
    const input = doc.getElementById('chat-input');
    const output = doc.getElementById('chat-output');
    output.textContent = '';
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    try {
      const messages = [{ role: 'user', content: message }];
      await chatImpl(messages, (token) => {
        output.textContent += token;
      });
    } catch (err) {
      output.textContent = err.message;
    }
  };
}

module.exports = { setupUI };
