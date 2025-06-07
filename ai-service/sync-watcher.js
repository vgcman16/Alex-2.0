const { syncMemory } = require('./cloud-sync');

function startSyncWatcher(url, {
  interval = 60000,
  file = 'memory.json',
  fetchFn = fetch,
  syncFn = syncMemory,
  setTimer = setInterval,
  clearTimer = clearInterval,
} = {}) {
  async function run() {
    try {
      await syncFn(url, file, fetchFn);
    } catch (err) {
      console.error('sync error:', err.message);
    }
  }
  const id = setTimer(run, interval);
  return {
    stop() {
      clearTimer(id);
    },
  };
}

module.exports = { startSyncWatcher };
