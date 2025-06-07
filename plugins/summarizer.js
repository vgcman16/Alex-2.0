const { streamChatCompletion } = require('../ai-service/openrouter');
const { runLlama } = require('../ai-service/llama');
const { getModel } = require('../app/model');

async function summarize(
  text,
  {
    streamChatCompletion: stream = streamChatCompletion,
    runLlama: llama = runLlama,
    getModel: getModelFn = getModel,
  } = {}
) {
  const messages = [
    { role: 'system', content: 'Summarize the following text in one sentence.' },
    { role: 'user', content: text },
  ];
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (apiKey) {
    let result = '';
    for await (const chunk of stream({
      messages,
      models: [getModelFn()],
      apiKey,
    })) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) result += content;
    }
    return result.trim();
  }
  if (process.env.LLAMA_PATH && process.env.LLAMA_MODEL) {
    const prompt = messages.map((m) => m.content).join('\n');
    return llama(prompt);
  }
  throw new Error('OPENROUTER_API_KEY is not set');
}

function activate(context = {}) {
  const { registerCommand } = context;
  if (registerCommand) {
    registerCommand('summarize', summarize);
  }
}

module.exports = { activate, summarize };
