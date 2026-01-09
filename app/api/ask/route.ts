import { cosineSimilarity } from "@/lib/cosineSimilarity"
import { embedChunks } from "@/lib/embedChunks"
import { embedQuery } from "@/lib/embedQuery"
import {
  getCachedEmbeddings,
  setCachedEmbeddings,
} from "@/lib/embeddingCache"
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const MAX_CHUNKS = 80
const SIMILARITY_THRESHOLD = 0.55

type AskRequestBody = {
  question: string
  chunks: string[]
  url: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AskRequestBody
    const { question, chunks, url } = body

    if (!question || !question.trim()) {
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
    let activeChunks: string[]
    let embeddings: number[][]

    const cached = getCachedEmbeddings(cacheKey)

    if (cached) {
      activeChunks = cached.chunks
      embeddings = cached.embeddings
      console.log("Using cached embeddings")
    } else {
      activeChunks = chunks.slice(0, MAX_CHUNKS)

      embeddings = await embedChunks(activeChunks)

      if (
        embeddings.length === 0 ||
        embeddings.length !== activeChunks.length
      ) {
        return NextResponse.json(
          { error: "Failed to generate embeddings" },
          { status: 500 }
        )
      }

      setCachedEmbeddings(cacheKey, activeChunks, embeddings)
      console.log("Embedded and cached page")
    }

    const questionEmbedding = await embedQuery(question)

    if (!questionEmbedding || questionEmbedding.length === 0) {
      return NextResponse.json(
        { error: "Failed to embed question" },
        { status: 500 }
      )
    }

    const scored = activeChunks.map((text, i) => ({
      text,
      score: cosineSimilarity(questionEmbedding, embeddings[i]),
    }))

    const sorted = scored.sort((a, b) => b.score - a.score)
    const topScore = sorted[0]?.score ?? 0

    console.log(
      sorted.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        score: Number(c.score.toFixed(3)),
        preview: c.text.slice(0, 80),
      }))
    )

    if (topScore < SIMILARITY_THRESHOLD) {
      return NextResponse.json({
        success: true,
        answer: "Not mentioned in the page.",
      })
    }

    const context = sorted
      .slice(0, 3)
      .map(c => c.text)
      .join("\n\n---\n\n")

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

    const ai = new GoogleGenAI({})
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    return NextResponse.json({
      success: true,
      answer: response.text,
    })
  } catch (err) {
    console.error("ASK ROUTE ERROR:", err)
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    )
  }
}
