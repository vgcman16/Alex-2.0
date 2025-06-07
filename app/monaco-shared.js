const { initYjs } = require('./yjs-webrtc');
const { MonacoBinding } = require('y-monaco');
const monaco = require('monaco-editor');

/**
 * Create a Monaco editor bound to a shared Yjs document.
 *
 * @param {HTMLElement} element - DOM element to mount the editor on.
 * @param {string} room - Room name for WebRTC syncing.
 * @returns {{editor: monaco.editor.IStandaloneCodeEditor, provider: any}}
 */
function createSharedMonaco(element, room = 'monaco-room') {
  const { doc, provider } = initYjs(room);
  const { awareness } = provider;
  const yText = doc.getText('monaco');
  const model = monaco.editor.createModel('', 'javascript');
  const editor = monaco.editor.create(element, {
    model,
    language: 'javascript',
    theme: 'vs-dark',
  });

  // assign random user colour and name for presence
  const user = {
    name: `User-${doc.clientID}`,
    color: `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')}`,
  };
  awareness.setLocalStateField('user', user);

  const applyStyles = (clientId, info) => {
    if (!info || !info.color || !info.name) return;
    const id = `yjs-style-${clientId}`;
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = `
      .yRemoteSelection-${clientId} { background-color: ${info.color}33; }
      .yRemoteSelectionHead-${clientId} { border-left: 2px solid ${info.color}; position: relative; }
      .yRemoteSelectionHead-${clientId}::after {
        content: '${info.name}';
        position: absolute;
        top: -1.2em;
        left: 0;
        background: ${info.color};
        color: white;
        font-size: 0.75em;
        padding: 2px 4px;
        border-radius: 4px;
        white-space: nowrap;
      }
    `;
  };

  // apply styles for existing peers and listen for new ones
  awareness.getStates().forEach((state, id) => {
    if (id !== doc.clientID) applyStyles(id, state.user);
  });
  awareness.on('update', ({ added, updated }) => {
    const states = awareness.getStates();
    for (const id of [...added, ...updated]) {
      if (id !== doc.clientID) applyStyles(id, states.get(id).user);
    }
  });

  new MonacoBinding(yText, model, new Set([editor]), awareness);
  return { editor, provider };
}

module.exports = { createSharedMonaco };
