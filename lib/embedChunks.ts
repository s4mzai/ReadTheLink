import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({})

export async function embedChunks(chunks: string[]) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: chunks,
  })

  return response.embeddings?.map(e => e.values) ?? []
}
