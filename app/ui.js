const { runChatWithMemory } = require('./chat-memory');
const { createVoiceCoder } = require('./voice');

function setupUI(
  doc,
  editor,
  {
    runChat: chatImpl = runChatWithMemory,
    createVoiceCoder: voiceCtor = createVoiceCoder,
  } = {}
) {
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
