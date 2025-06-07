let currentModel = 'openrouter/openai/gpt-3.5-turbo';

function setModel(model) {
  if (typeof model === 'string' && model.trim()) {
    currentModel = model;
  }
}

function getModel() {
  return currentModel;
}

module.exports = { setModel, getModel };
