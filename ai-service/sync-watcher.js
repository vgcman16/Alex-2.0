const { syncMemory } = require('./cloud-sync');

const fs = require('fs');

function startSyncWatcher(
  url,
  {
    interval = 60000,
    file = 'memory.json',
    fetchFn = fetch,
    syncFn = syncMemory,
    setTimer = setInterval,
    clearTimer = clearInterval,
    watchFile = fs.watchFile,
    unwatchFile = fs.unwatchFile,
  } = {}
) {
  let running = false;
  async function run() {
    if (running) return;
    running = true;
    try {
      await syncFn(url, file, fetchFn);
    } catch (err) {
      console.error('sync error:', err.message);
    } finally {
      running = false;
    }
  }
  const id = setTimer(run, interval);
  watchFile(file, { persistent: false }, run);
  return {
    stop() {
      clearTimer(id);
      unwatchFile(file, run);
    },
  };
}

module.exports = { startSyncWatcher };
