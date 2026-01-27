import { prompts } from './prompts'
const MODEL = '@cf/meta/llama-3-8b-instruct'

export const aiService = {
  async parseTask(input: string, env: any) {
    const prompt = prompts.parseTask(input)
    const result = await env.AI.run(MODEL, { prompt })
    return result?.response ?? result
  },
  async suggestPriority(task: any, env: any) {
    const prompt = prompts.suggestPriority(task)
    const result = await env.AI.run(MODEL, { prompt })
    return result?.response ?? result
  },
  async estimateDuration(task: any, env: any) {
    const prompt = prompts.estimateDuration(task)
    const result = await env.AI.run(MODEL, { prompt })
    return result?.response ?? result
  },
  async categorizeTask(task: any, env: any) {
    const prompt = prompts.categorizeTask(task)
    const result = await env.AI.run(MODEL, { prompt })
    return result?.response ?? result
  },
}
