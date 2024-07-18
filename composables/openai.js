import OpenAI from 'openai'

let openai = null

export const useOpenAI = async (api, method, sub, body) => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: useRuntimeConfig().public.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  }
  if (sub) {
    return openai[api][method][sub](body)
  } else {
    return openai[api][method](body)
  }
  
}