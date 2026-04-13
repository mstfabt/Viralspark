import { GoogleGenAI } from '@google/genai'

let _client: GoogleGenAI | null = null

export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')
    _client = new GoogleGenAI({ apiKey })
  }
  return _client
}

export type GenerateOptions = {
  maxOutputTokens?: number
  temperature?: number
}

export async function generateContent(
  prompt: string,
  options: GenerateOptions = {},
): Promise<string> {
  const client = getGeminiClient()

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Thinking kapalı — maliyet %80 düşer
      },
      maxOutputTokens: options.maxOutputTokens,
      temperature: options.temperature,
    },
  })

  return response.text || ''
}
