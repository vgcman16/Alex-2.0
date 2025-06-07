const { streamChatCompletion } = require('../ai-service/openrouter')

const DEFAULT_REVIEWERS = [
  { name: 'Senior Dev', prompt: 'You are a senior developer providing a thorough code review.' },
  { name: 'Security Expert', prompt: 'You are a security expert reviewing for security issues.' }
]

async function review(diff, { reviewers = DEFAULT_REVIEWERS, streamChatCompletion: stream = streamChatCompletion } = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!diff) throw new Error('diff is required')
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const comments = []
  for (const r of reviewers) {
    const messages = [
      { role: 'system', content: r.prompt },
      { role: 'user', content: diff }
    ]
    let text = ''
    for await (const delta of stream({
      messages,
      models: ['openrouter/openai/gpt-3.5-turbo'],
      apiKey
    })) {
      const content = delta.choices?.[0]?.delta?.content
      if (content) text += content
    }
    comments.push({ reviewer: r.name, comment: text.trim() })
  }
  return comments
}

module.exports = { review }
