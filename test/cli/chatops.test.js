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
    let args;
    const code = await main(['sync', 'https://ex', '/tmp/mem.json'], {
      planFn: async () => 'x',
      syncFn: async (url, file) => {
        args = `${url}|${file}`;
      },
      uploadFn: async () => {},
      downloadFn: async () => {},
      watchFn: async () => {},
    });
    expect(args).to.equal('https://ex|/tmp/mem.json');
    expect(code).to.equal(0);
  });

  it('runs upload command', async () => {
    let args;
    const code = await main(['upload', 'https://ex', '/tmp/mem.json'], {
      planFn: async () => {},
      syncFn: async () => {},
      uploadFn: async (url, file) => {
        args = `${url}|${file}`;
      },
      downloadFn: async () => {},
      watchFn: async () => {},
    });
    expect(args).to.equal('https://ex|/tmp/mem.json');
    expect(code).to.equal(0);
  });

  it('runs download command', async () => {
    let args;
    const code = await main(['download', 'https://ex', '/tmp/mem.json'], {
      planFn: async () => {},
      syncFn: async () => {},
      uploadFn: async () => {},
      downloadFn: async (url, file) => {
        args = `${url}|${file}`;
      },
      watchFn: async () => {},
    });
    expect(args).to.equal('https://ex|/tmp/mem.json');
    expect(code).to.equal(0);
  });

  it('starts watch command', async () => {
    let args;
    let called = false;
    const code = await main(['watch', 'https://ex', '/tmp/mem.json'], {
      planFn: async () => {},
      syncFn: async () => {},
      uploadFn: async () => {},
      downloadFn: async () => {},
      watchFn: (url, opts) => {
        args = `${url}|${opts.file}`;
        called = true;
        return { stop() {} };
      },
    });
    expect(args).to.equal('https://ex|/tmp/mem.json');
    expect(called).to.be.true;
    expect(code).to.equal(0);
  });

  it('runs search command', async () => {
    let dirArg;
    let termArg;
    const code = await main(['search', 'foo', '/tmp'], {
      planFn: async () => {},
      syncFn: async () => {},
      uploadFn: async () => {},
      downloadFn: async () => {},
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

  it('shows telemetry info', async () => {
    let printed = [];
    const oldLog = console.log;
    console.log = (msg) => printed.push(msg);
    const code = await main(['telemetry'], {
      eventCountsFn: () => ({ start: 2 }),
      costFn: () => 1.5,
      planFn: async () => {},
      syncFn: async () => {},
      uploadFn: async () => {},
      downloadFn: async () => {},
      watchFn: async () => {},
    });
    console.log = oldLog;
    expect(printed).to.deep.equal(['start: 2', 'Total cost: 1.5']);
    expect(code).to.equal(0);
  });

  it('returns error on unknown command', async () => {
    const code = await main(['unknown'], {
      planFn: async () => {},
      syncFn: async () => {},
      uploadFn: async () => {},
      downloadFn: async () => {},
      watchFn: async () => {},
    });
    expect(code).to.equal(1);
  });
});
