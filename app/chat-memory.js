const { runChat } = require('./chat');
const { append } = require('../ai-service/memory-store');
const { syncMemory } = require('../ai-service/cloud-sync');

/**
 * Run chat and persist the conversation to disk.
 *
 * @param {Array<{role:string,content:string}>} messages Chat messages
 * @param {(token:string)=>void} onToken Callback for streamed tokens
 * @param {object} [options]
 * @param {string} [options.memoryFile=process.env.MEMORY_FILE] Path to memory JSON file
 * @param {string} [options.syncUrl=process.env.MEMORY_SYNC_URL] Remote URL for cloud sync
 * @param {Function} [options.runChat] Chat implementation
 * @param {Function} [options.appendFn] Append function for testing
 * @param {Function} [options.syncFn] Sync function for testing
 * @returns {Promise<void>}
 */
async function runChatWithMemory(
  messages,
  onToken,
  {
    memoryFile = process.env.MEMORY_FILE,
    syncUrl = process.env.MEMORY_SYNC_URL,
    runChat: chatImpl = runChat,
    appendFn = append,
    syncFn = syncMemory,
    ...chatOpts
  } = {}
) {
  let response = '';
  await chatImpl(
    messages,
    (tok) => {
      response += tok;
      if (onToken) onToken(tok);
    },
    chatOpts
  );
  if (memoryFile) {
    for (const m of messages) appendFn(m, memoryFile);
    appendFn({ role: 'assistant', content: response }, memoryFile);
    if (syncUrl) {
      try {
        await syncFn(syncUrl, memoryFile);
      } catch (err) {
        console.error('sync error:', err.message);
      }
    }
  }
}

module.exports = { runChatWithMemory };
