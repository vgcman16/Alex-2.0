const { streamChatCompletion } = require('../ai-service/openrouter')

async function plan(goal, { streamChatCompletion: stream = streamChatCompletion } = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!goal) throw new Error('goal is required')
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const messages = [
    { role: 'system', content: 'You are a helpful assistant that breaks a goal into a numbered step-by-step plan.' },
    { role: 'user', content: `Goal: ${goal}` }
  ]

  let result = ''
  for await (const delta of stream({
    messages,
    models: ['openrouter/openai/gpt-3.5-turbo'],
    apiKey
  })) {
    const content = delta.choices?.[0]?.delta?.content
    if (content) result += content
  }
  return result.trim()
}

async function main() {
  const goal = process.argv.slice(2).join(' ')
  try {
    const output = await plan(goal)
    console.log(output)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { plan }
