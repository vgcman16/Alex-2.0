const { expect } = require('chai');
const { runTests } = require('../../agent/test-runner');

describe('runTests', () => {
  it('runs once on success', () => {
    let calls = 0;
    const exec = () => { calls++; return { status: 0 }; };
    runTests({ exec });
    expect(calls).to.equal(1);
  });

  it('retries until success', () => {
    let calls = 0;
    const exec = () => { calls++; return { status: calls === 2 ? 0 : 1 }; };
    runTests({ retries: 2, exec });
    expect(calls).to.equal(2);
  });

  it('throws after exceeding retries', () => {
    let calls = 0;
    const exec = () => { calls++; return { status: 1 }; };
    let err;
    try {
      runTests({ retries: 1, exec });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('Tests failed');
    expect(calls).to.equal(2);
  });
});
