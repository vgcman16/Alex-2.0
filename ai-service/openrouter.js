// Simple OpenRouter API wrapper with streaming and provider fallback
// Uses Node's global fetch API (Node 18+)

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Streams chat completions from OpenRouter. Tries models in order until one
 * succeeds. Each streamed chunk yields the parsed JSON `choices` object.
 *
 * @param {Object[]} messages Chat messages as defined by OpenAI API
 * @param {string[]} models Array of model identifiers to try sequentially
 * @param {string} apiKey OpenRouter API key
 * @returns {AsyncGenerator<Object>} async generator yielding completion deltas
 */
async function* streamChatCompletion({ messages, models, apiKey }) {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required');
  }
  if (!Array.isArray(models) || models.length === 0) {
    throw new Error('models must be a non-empty array');
  }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, stream: true }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary;
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const chunk = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 2);
          if (chunk.startsWith('data:')) {
            const data = chunk.replace(/^data:\s*/, '');
            if (data === '[DONE]') return;
            yield JSON.parse(data);
          }
        }
      }
      return; // finished without [DONE]
    } catch (err) {
      clearTimeout(timer);
      if (i === models.length - 1) {
        throw err;
      }
      // otherwise, try next model
    }
  }
}

module.exports = { streamChatCompletion };
