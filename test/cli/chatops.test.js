const { expect } = require('chai');
const { main } = require('../../cli/chatops');

describe('chatops CLI', () => {
  it('runs plan command', async () => {
    let goalArg;
    const code = await main(['plan', 'build', 'feature'], {
      planFn: async (goal) => {
        goalArg = goal;
        return 'ok';
      },
      syncFn: async () => {},
    });
    expect(goalArg).to.equal('build feature');
    expect(code).to.equal(0);
  });

  it('runs sync command', async () => {
    let urlArg;
    const code = await main(['sync', 'https://ex'], {
      planFn: async () => 'x',
      syncFn: async (url) => {
        urlArg = url;
      },
      watchFn: async () => {},
    });
    expect(urlArg).to.equal('https://ex');
    expect(code).to.equal(0);
  });

  it('starts watch command', async () => {
    let urlArg;
    let called = false;
    const code = await main(['watch', 'https://ex'], {
      planFn: async () => {},
      syncFn: async () => {},
      watchFn: (url) => {
        urlArg = url;
        called = true;
        return { stop() {} };
      },
    });
    expect(urlArg).to.equal('https://ex');
    expect(called).to.be.true;
    expect(code).to.equal(0);
  });

  it('runs search command', async () => {
    let dirArg;
    let termArg;
    const code = await main(['search', 'foo', '/tmp'], {
      planFn: async () => {},
      syncFn: async () => {},
      watchFn: async () => {},
      indexFn: (dir) => {
        dirArg = dir;
        return { dir };
      },
      searchFn: (idx, term) => {
        termArg = term;
        return [{ file: 'a.js', line: 1, text: 'foo' }];
      },
    });
    expect(dirArg).to.equal('/tmp');
    expect(termArg).to.equal('foo');
    expect(code).to.equal(0);
  });

  it('returns error on unknown command', async () => {
    const code = await main(['unknown'], {
      planFn: async () => {},
      syncFn: async () => {},
      watchFn: async () => {},
    });
    expect(code).to.equal(1);
  });
});
