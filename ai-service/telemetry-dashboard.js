const { recordUsage, getTotalCost, getHistory, reset: resetCost } = require('./cost-dashboard');

const events = [];

/**
 * Record a telemetry event.
 * If the event type is 'usage', the data is also passed to the cost dashboard.
 * @param {string} type - Event type name
 * @param {object} [data] - Optional data payload
 */
function recordEvent(type, data = {}) {
  if (type === 'usage') {
    recordUsage(data);
  }
  events.push({ type, data, time: Date.now() });
}

function getEvents() {
  return events.slice();
}

function getEventCounts() {
  const counts = {};
  for (const e of events) {
    counts[e.type] = (counts[e.type] || 0) + 1;
  }
  return counts;
}

function reset() {
  events.length = 0;
  resetCost();
}

module.exports = {
  recordEvent,
  getEvents,
  getEventCounts,
  getTotalCost,
  getHistory,
  reset,
};
