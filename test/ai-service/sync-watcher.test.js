const { expect } = require('chai');
const { startSyncWatcher } = require('../../ai-service/sync-watcher');

describe('sync watcher', () => {
  it('invokes sync on interval', async () => {
    let fn;
    const timerIds = [];
    function setTimer(cb) {
      fn = cb;
      const id = timerIds.length + 1;
      timerIds.push(id);
      return id;
    }
    let clearedId;
    function clearTimer(id) {
      clearedId = id;
    }
    let calls = 0;
    const watcher = startSyncWatcher('u', {
      interval: 10,
      syncFn: async () => { calls++; },
      setTimer,
      clearTimer,
      fetchFn: async () => new Response('[]', { status: 200 })
    });
    await fn();
    expect(calls).to.equal(1);
    watcher.stop();
    expect(clearedId).to.equal(timerIds[0]);
  });

  it('swallows errors from sync', async () => {
    let fn;
    const watcher = startSyncWatcher('u', {
      interval: 5,
      syncFn: async () => { throw new Error('fail'); },
      setTimer: (cb) => { fn = cb; return 1; },
      clearTimer: () => {},
    });
    await fn();
    watcher.stop();
  });
});
