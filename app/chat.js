const { streamChatCompletion } = require('../ai-service/openrouter');
const { runLlama } = require('../ai-service/llama');
const { getModel } = require('./model');

async function runChat(
  messages,
  onToken,
  {
    streamChatCompletion: stream = streamChatCompletion,
    runLlama: llama = runLlama,
  } = {}
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (apiKey) {
    for await (const chunk of stream({
      messages,
      models: [getModel()],
      apiKey,
    })) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) onToken(content);
    }
    return;
  }
  if (process.env.LLAMA_PATH && process.env.LLAMA_MODEL) {
    const prompt = messages.map((m) => m.content).join('\n');
    const text = await llama(prompt);
    onToken(text);
    return;
  }
  throw new Error('OPENROUTER_API_KEY is not set');
}

module.exports = { runChat };
