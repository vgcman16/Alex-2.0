const { expect } = require('chai');
const {
  recordEvent,
  getEvents,
  getEventCounts,
  getTotalCost,
  getHistory,
  reset,
} = require('../../ai-service/telemetry-dashboard');

describe('telemetry dashboard', () => {
  afterEach(() => reset());

  it('records events and counts them', () => {
    recordEvent('start');
    recordEvent('start');
    recordEvent('stop');
    expect(getEvents()).to.have.length(3);
    expect(getEventCounts()).to.deep.equal({ start: 2, stop: 1 });
  });

  it('tracks usage cost via cost dashboard', () => {
    recordEvent('usage', { cost: 1 });
    recordEvent('usage', { cost: 2 });
    expect(getTotalCost()).to.equal(3);
    expect(getHistory()).to.deep.equal([{ cost: 1 }, { cost: 2 }]);
  });
});
