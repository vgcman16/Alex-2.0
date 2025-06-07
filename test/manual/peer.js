const { initYjs } = require('../../app/yjs-webrtc');
const room = process.argv[2] || 'test-room';
const initText = process.argv[3];

const { doc, provider } = initYjs(room);
const yText = doc.getText('monaco');

if (initText) {
  yText.insert(0, initText);
}

setTimeout(() => {
  console.log('content:', yText.toString());
  provider.destroy();
  process.exit(0);
}, 5000);
