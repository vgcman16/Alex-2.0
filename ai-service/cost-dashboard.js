let total = 0;
const history = [];

/**
 * Record usage information from an OpenRouter response.
 * @param {object} usage - Usage object containing at least a `cost` number.
 */
function recordUsage(usage) {
  if (!usage || typeof usage.cost !== 'number') return;
  history.push(usage);
  total += usage.cost;
}

function getTotalCost() {
  return total;
}

function getHistory() {
  return history.slice();
}

function reset() {
  total = 0;
  history.length = 0;
}

module.exports = { recordUsage, getTotalCost, getHistory, reset };
