const { streamChatCompletion } = require('../ai-service/openrouter');

async function runChat(messages, onToken) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }
  for await (const chunk of streamChatCompletion({
    messages,
    models: ['openrouter/openai/gpt-3.5-turbo'],
    apiKey
  })) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) onToken(content);
  }
}

module.exports = { runChat };
