const { expect } = require('chai');
const {
  recordUsage,
  getTotalCost,
  getHistory,
  reset,
} = require('../../ai-service/cost-dashboard');

describe('cost dashboard', () => {
  afterEach(() => reset());

  it('aggregates cost from usage objects', () => {
    recordUsage({ cost: 1.5 });
    recordUsage({ cost: 2 });
    expect(getTotalCost()).to.equal(3.5);
    expect(getHistory()).to.deep.equal([{ cost: 1.5 }, { cost: 2 }]);
  });

  it('ignores invalid usage data', () => {
    recordUsage(null);
    recordUsage({});
    recordUsage({ cost: 'x' });
    expect(getTotalCost()).to.equal(0);
    expect(getHistory()).to.deep.equal([]);
  });
});
