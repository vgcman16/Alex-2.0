const defaultOptions = process.env.MODEL_OPTIONS
  ? process.env.MODEL_OPTIONS.split(',')
      .map((m) => m.trim())
      .filter(Boolean)
  : ['openrouter/openai/gpt-3.5-turbo', 'openrouter/openai/gpt-4'];

let modelOptions = defaultOptions.slice();
let currentModel = modelOptions[0];

function setModel(model) {
  if (typeof model === 'string' && model.trim()) {
    currentModel = model;
    if (!modelOptions.includes(model)) {
      modelOptions.push(model);
    }
  }
}

function getModel() {
  return currentModel;
}

function getModelOptions() {
  return modelOptions.slice();
}

module.exports = { setModel, getModel, getModelOptions };
