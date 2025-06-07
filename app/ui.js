const { runChatWithMemory } = require('./chat-memory');
const { createVoiceCoder } = require('./voice');
const { startSyncWatcher } = require('../ai-service/sync-watcher');
const { previewPatch, applyPatch } = require('./patcher');

function setupUI(
  doc,
  editor,
  {
    runChat: chatImpl = runChatWithMemory,
    createVoiceCoder: voiceCtor = createVoiceCoder,
    startSyncWatcher: watcherCtor = startSyncWatcher,
    previewPatch: preview = previewPatch,
    applyPatch: applyFn = applyPatch,
    monaco: monacoLib,
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
  const voiceBtn = doc.getElementById('voice-btn');
  const voiceLabel = voiceBtn.querySelector('span') || voiceBtn;
  voiceBtn.onclick = () => {
    if (!voice) {
      try {
        voice = voiceCtor(editor);
        voice.start();
        voiceLabel.textContent = 'Stop';
      } catch (err) {
        if (typeof alert !== 'undefined') alert(err.message);
      }
    } else {
      voice.stop();
      voice = null;
      voiceLabel.textContent = 'Voice';
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

  const patchInput = doc.getElementById('patch-input');
  const applyBtn = doc.getElementById('apply-patch');
  const diffEl = doc.getElementById('diff-editor');
  let diffEditor;
  if (patchInput && applyBtn && diffEl) {
    const updateDiff = () => {
      try {
        const { original, patched } = (preview || previewPatch)(
          patchInput.value
        );
        const mon = monacoLib || require('monaco-editor');
        if (!diffEditor) {
          diffEditor = mon.editor.createDiffEditor(diffEl, { readOnly: true });
        }
        const o = mon.editor.createModel(original, 'javascript');
        const m = mon.editor.createModel(patched, 'javascript');
        diffEditor.setModel({ original: o, modified: m });
      } catch (err) {
        if (diffEditor) diffEditor.dispose();
        diffEditor = null;
        diffEl.textContent = err.message;
      }
    };
    patchInput.addEventListener('input', updateDiff);
    applyBtn.onclick = () => {
      try {
        (applyFn || applyPatch)(patchInput.value);
        updateDiff();
        if (typeof alert !== 'undefined') alert('Patch applied');
      } catch (err) {
        if (typeof alert !== 'undefined') alert(err.message);
      }
    };
  }

  const themeBtn = doc.getElementById('theme-toggle');
  if (themeBtn) {
    const themeIcon = themeBtn.querySelector('i');
    const applyTheme = (theme) => {
      doc.body.classList.remove('light', 'dark');
      doc.body.classList.add(theme);
      try {
        if (doc.defaultView && doc.defaultView.localStorage) {
          doc.defaultView.localStorage.setItem('theme', theme);
        }
      } catch {}
      if (themeIcon) {
        themeIcon.setAttribute(
          'data-feather',
          theme === 'dark' ? 'sun' : 'moon'
        );
        try {
          if (doc.defaultView && doc.defaultView.feather) {
            doc.defaultView.feather.replace();
          }
        } catch {}
      }
    };
    let theme = 'dark';
    try {
      if (doc.defaultView && doc.defaultView.localStorage) {
        theme = doc.defaultView.localStorage.getItem('theme') || 'dark';
      }
    } catch {}
    applyTheme(theme);
    themeBtn.onclick = () => {
      const next = doc.body.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
    };
  }
}

module.exports = { setupUI };
