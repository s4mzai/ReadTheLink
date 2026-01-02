import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({})

export async function embedQuery(question: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [question],
  })

  return response.embeddings?.[0]?.values ?? []
}
