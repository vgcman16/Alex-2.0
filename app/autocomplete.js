const { streamChatCompletion } = require('../ai-service/openrouter');

async function fetchCompletion(prefix, { streamChatCompletion: stream = streamChatCompletion } = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');
  const messages = [{ role: 'user', content: prefix }];
  let result = '';
  for await (const chunk of stream({
    messages,
    models: ['openrouter/openai/gpt-3.5-turbo'],
    apiKey
  })) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) result += content;
  }
  return result.trim();
}

function enableInlineCompletion(editor) {
  const monaco = require('monaco-editor');
  const provider = {
    async provideInlineCompletions(model, position) {
      const prefix = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
      try {
        const text = await fetchCompletion(prefix);
        if (!text) return { items: [] };
        return {
          items: [
            {
              insertText: text,
              range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            }
          ]
        };
      } catch {
        return { items: [] };
      }
    },
    freeInlineCompletions() {}
  };
  monaco.languages.registerInlineCompletionsProvider('javascript', provider);

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
    editor.trigger('keyboard', 'inlineSuggest.trigger', {});
  });
}

module.exports = { fetchCompletion, enableInlineCompletion };
