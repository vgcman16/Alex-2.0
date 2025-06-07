const Y = require('yjs');

// polyfill required globals when running in Node.js
if (typeof WebSocket === 'undefined') {
  global.WebSocket = require('ws');
}
if (typeof navigator === 'undefined') {
  global.navigator = {};
}

const { WebrtcProvider } = require('y-webrtc');

/**
 * Initialize a Yjs document and connect to a WebRTC signaling server.
 *
 * @param {string} room - Unique identifier for the shared document room.
 * @returns {{doc: Y.Doc, provider: WebrtcProvider}}
 */
function initYjs(room = 'default-room') {
  const doc = new Y.Doc();
  const awareness = new (require('y-protocols/awareness').Awareness)(doc);
  const provider = new WebrtcProvider(room, doc, {
    signaling: ['wss://signaling.yjs.dev'],
    password: null,
    awareness,
  });
  return { doc, provider };
}

module.exports = { initYjs };
