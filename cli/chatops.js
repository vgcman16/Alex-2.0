#!/usr/bin/env node
const { plan } = require('../agent/task-planner');
const { syncMemory } = require('../ai-service/cloud-sync');
const { startSyncWatcher } = require('../ai-service/sync-watcher');
const { createIndex, search: searchIdx } = require('../search/indexer');

async function main(
  argv = process.argv.slice(2),
  {
    planFn = plan,
    syncFn = syncMemory,
    watchFn = startSyncWatcher,
    indexFn = createIndex,
    searchFn = searchIdx,
  } = {}
) {
  const [cmd, ...args] = argv;
  if (cmd === 'plan') {
    const goal = args.join(' ');
    if (!goal) {
      console.error('Usage: chatops plan <goal>');
      return 1;
    }
    try {
      const result = await planFn(goal);
      console.log(result);
      return 0;
    } catch (err) {
      console.error(err.message);
      return 1;
    }
  }
  if (cmd === 'sync') {
    const url = args[0];
    if (!url) {
      console.error('Usage: chatops sync <url>');
      return 1;
    }
    try {
      await syncFn(url);
      console.log('Sync complete');
      return 0;
    } catch (err) {
      console.error(err.message);
      return 1;
    }
  }
  if (cmd === 'watch') {
    const url = args[0];
    if (!url) {
      console.error('Usage: chatops watch <url>');
      return 1;
    }
    try {
      watchFn(url);
      console.log('Watcher started');
      return 0;
    } catch (err) {
      console.error(err.message);
      return 1;
    }
  }
  if (cmd === 'search') {
    const term = args[0];
    const dir = args[1] || '.';
    if (!term) {
      console.error('Usage: chatops search <term> [dir]');
      return 1;
    }
    try {
      const idx = indexFn(dir);
      const results = searchFn(idx, term);
      for (const r of results) {
        console.log(`${r.file}:${r.line}: ${r.text}`);
      }
      return 0;
    } catch (err) {
      console.error(err.message);
      return 1;
    }
  }
  console.error('Usage: chatops <command> [args...]');
  console.error('Commands: plan, sync, watch, search');
  return 1;
}

if (require.main === module) {
  main().then((code) => { if (code !== 0) process.exit(code); });
}

module.exports = { main };
