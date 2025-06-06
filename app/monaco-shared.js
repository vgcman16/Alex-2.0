const { initYjs } = require('./yjs-webrtc')
const { MonacoBinding } = require('y-monaco')
const monaco = require('monaco-editor')

/**
 * Create a Monaco editor bound to a shared Yjs document.
 *
 * @param {HTMLElement} element - DOM element to mount the editor on.
 * @param {string} room - Room name for WebRTC syncing.
 * @returns {{editor: monaco.editor.IStandaloneCodeEditor, provider: any}}
 */
function createSharedMonaco(element, room = 'monaco-room') {
  const { doc, provider } = initYjs(room)
  const yText = doc.getText('monaco')
  const model = monaco.editor.createModel('', 'javascript')
  const editor = monaco.editor.create(element, {
    model,
    language: 'javascript',
    theme: 'vs-dark',
  })
  new MonacoBinding(yText, model, new Set([editor]), provider.awareness)
  return { editor, provider }
}

module.exports = { createSharedMonaco }
