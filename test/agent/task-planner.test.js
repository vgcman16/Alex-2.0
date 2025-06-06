const { expect } = require('chai')
const { plan } = require('../../agent/task-planner')

function mockStream(chunks) {
  return (async function* () {
    for (const content of chunks) {
      yield { choices: [{ delta: { content } }] }
    }
  })()
}

describe('plan', () => {
  it('returns concatenated plan from stream', async () => {
    process.env.OPENROUTER_API_KEY = 'test'
    const result = await plan('build feature', {
      streamChatCompletion: () => mockStream(['1. a', '\n2. b'])
    })
    expect(result).to.equal('1. a\n2. b')
  })

  it('throws when API key missing', async () => {
    delete process.env.OPENROUTER_API_KEY
    let err
    try {
      await plan('goal', { streamChatCompletion: () => mockStream([]) })
    } catch (e) {
      err = e
    }
    expect(err).to.be.instanceOf(Error)
    expect(err.message).to.equal('OPENROUTER_API_KEY is not set')
  })
})
