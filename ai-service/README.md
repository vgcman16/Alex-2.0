# AI Service

This folder holds service components that interface with AI models.

These scripts require **Node.js v18 or higher** to run properly.

## OpenRouter Wrapper

`openrouter.js` exposes a `streamChatCompletion` function that returns an async generator for streamed chat completions. It accepts an array of models and automatically falls back to the next model if the current one fails or does not respond within five seconds.

### API Key Setup

Export `OPENROUTER_API_KEY` with your OpenRouter API key before running the examples:

```bash
export OPENROUTER_API_KEY=sk-your-key
```

You can also place the key in a `.env` file (ignored by Git) and load it using `dotenv` or a similar tool.

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
