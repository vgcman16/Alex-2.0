const { expect } = require('chai');
const { createVoiceCoder } = require('../../app/voice');

class MockRecognition {
  constructor() {
    this.onresult = () => {};
  }
  start() {
    this.onstart && this.onstart();
    this.onresult({ results: [[{ transcript: 'hello' }]] });
  }
  stop() {
    this.onstop && this.onstop();
  }
}

describe('createVoiceCoder', () => {
  it('inserts transcript on result', () => {
    const edits = [];
    const editor = {
      getSelection: () => ({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      }),
      executeEdits: (_source, ops) => {
        edits.push(ops[0].text);
      },
    };
    const coder = createVoiceCoder(editor, MockRecognition);
    coder.start();
    expect(edits).to.deep.equal(['hello']);
  });

  it('throws if Recognition missing', () => {
    let err;
    try {
      createVoiceCoder({});
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
  });
});
