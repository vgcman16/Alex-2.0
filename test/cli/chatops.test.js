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
    });
    expect(urlArg).to.equal('https://ex');
    expect(code).to.equal(0);
  });

  it('returns error on unknown command', async () => {
    const code = await main(['unknown'], {
      planFn: async () => {},
      syncFn: async () => {},
    });
    expect(code).to.equal(1);
  });
});
