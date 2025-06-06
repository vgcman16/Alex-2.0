# AI Service

This folder holds service components that interface with AI models.

## OpenRouter Wrapper

`openrouter.js` exposes a `streamChatCompletion` function that returns an async generator for streamed chat completions. It accepts an array of models and automatically falls back to the next model if the current one fails or does not respond within five seconds.

Example usage:

```javascript
const { streamChatCompletion } = require('./openrouter');

(async () => {
  const messages = [{ role: 'user', content: 'Hello!' }];
  for await (const chunk of streamChatCompletion({
    messages,
    models: ['openrouter/openai/gpt-3.5-turbo', 'openrouter/mistralai/mistral-7b'],
    apiKey: process.env.OPENROUTER_API_KEY,
  })) {
    console.log(chunk);
  }
})();
```
