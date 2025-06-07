const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const { setupUI } = require('../../app/ui');

describe('UI integration', () => {
  function createDom() {
    const html = `<!DOCTYPE html><div id="container"></div><input id="chat-input"><button id="chat-send">Send</button><button id="voice-btn">Voice</button><pre id="chat-output"></pre>`;
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  it('sends chat and displays response', async () => {
    const doc = createDom();
    let messages;
    setupUI(
      doc,
      {},
      {
        runChat: async (msgs, onToken) => {
          messages = msgs;
          onToken('hi');
        },
        createVoiceCoder: () => ({ start() {}, stop() {} }),
      }
    );
    doc.getElementById('chat-input').value = 'hello';
    await doc.getElementById('chat-send').onclick();
    expect(messages).to.deep.equal([{ role: 'user', content: 'hello' }]);
    expect(doc.getElementById('chat-output').textContent).to.equal('hi');
    expect(doc.getElementById('chat-input').value).to.equal('');
  });

  it('toggles voice coder on button click', () => {
    const doc = createDom();
    let started = false;
    let stopped = false;
    const voice = {
      start: () => {
        started = true;
      },
      stop: () => {
        stopped = true;
      },
    };
    setupUI(
      doc,
      {},
      {
        runChat: async () => {},
        createVoiceCoder: () => voice,
      }
    );
    const btn = doc.getElementById('voice-btn');
    btn.onclick();
    expect(started).to.be.true;
    expect(btn.textContent).to.equal('Stop');
    btn.onclick();
    expect(stopped).to.be.true;
    expect(btn.textContent).to.equal('Voice');
  });

  it('starts sync watcher when MEMORY_SYNC_URL set', () => {
    const doc = createDom();
    process.env.MEMORY_SYNC_URL = 'https://remote';
    process.env.MEMORY_FILE = 'm.json';
    let args;
    let stopped = false;
    setupUI(
      doc,
      {},
      {
        runChat: async () => {},
        createVoiceCoder: () => ({ start() {}, stop() {} }),
        startSyncWatcher: (url, opts) => {
          args = `${url}|${opts.file}`;
          return { stop: () => { stopped = true; } };
        },
      }
    );
    expect(args).to.equal('https://remote|m.json');
    doc.defaultView.dispatchEvent(new doc.defaultView.Event('beforeunload'));
    expect(stopped).to.be.true;
    delete process.env.MEMORY_SYNC_URL;
    delete process.env.MEMORY_FILE;
  });
});
