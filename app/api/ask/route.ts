import { cosineSimilarity } from "@/lib/cosineSimilarity"
import { embedChunks } from "@/lib/embedChunks"
import { embedQuery } from "@/lib/embedQuery"
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

import {
  getCachedEmbeddings,
  setCachedEmbeddings,
} from "@/lib/embeddingCache"

type AskRequestBody = {
  question: string
  chunks: string[]
  url: string
}

type EmbeddedChunk = {
  text: string
  embedding: number[]
}

export async function POST(req: Request) {
  const body = (await req.json()) as AskRequestBody
  const { question, chunks, url } = body

  if (!question?.trim()) {
    return NextResponse.json(
      { error: "Question is empty" },
      { status: 400 }
    )
  }

  if (!url || !chunks || chunks.length === 0) {
    return NextResponse.json(
      { error: "Missing url or chunks" },
      { status: 400 }
    )
  }

  const cacheKey = url

  let cleanEmbeddings: number[][]

  const cached = getCachedEmbeddings(cacheKey)

  if (cached) {
    cleanEmbeddings = cached.embeddings
    console.log("Using cached embeddings")
  } else {
    const rawEmbeddings = await embedChunks(chunks)

    cleanEmbeddings = []
    rawEmbeddings.forEach(e => {
      if (e) cleanEmbeddings.push(e)
    })

    if (cleanEmbeddings.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate embeddings" },
        { status: 500 }
      )
    }

    setCachedEmbeddings(cacheKey, chunks, cleanEmbeddings)
    console.log("Embedding chunks and caching")
  }

  // build embeddedChunks using cleanEmbeddings
  const embeddedChunks: EmbeddedChunk[] = chunks.map((text, i) => ({
    text,
    embedding: cleanEmbeddings[i],
  }))

  const questionEmbedding = await embedQuery(question)

  const scored = embeddedChunks.map(chunk => ({
    text: chunk.text,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }))

  const sorted = scored.sort((a, b) => b.score - a.score)

  console.log(
    sorted.slice(0, 3).map((c, i) => ({
      rank: i + 1,
      score: c.score,
      preview: c.text.slice(0, 80),
    }))
  )

  const topScore = sorted[0]?.score ?? 0
  if (topScore < 0.55) {
    return NextResponse.json({
      success: true,
      answer: "Not mentioned in the page.",
    })
  }

  const topChunks = sorted.slice(0, 3).map(c => c.text)
  const context = topChunks.join("\n\n---\n\n")

  const prompt = `
You are given excerpts from a webpage.

Context:
${context}

Question:
${question}

Instructions:
Answer using ONLY the context above.
If the answer is not present, say:
"Not mentioned in the page."

Answer:
`

  try {
    const ai = new GoogleGenAI({})
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    return NextResponse.json({
      success: true,
      answer: response.text,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    )
  }
}
