import { cosineSimilarity } from "@/lib/cosineSimilarity"
import { embedChunks } from "@/lib/embedChunks"
import { embedQuery } from "@/lib/embedQuery"
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"


type AskRequestBody = {
    question: string
    chunks: string[]
}
  
type EmbeddedChunk = {
    text: string
    embedding: number[]
}

export async function POST(req:Request){
    const body = (await req.json()) as AskRequestBody
    const { question, chunks } = body

    if (!question.trim()) return

    if (!question || !chunks || chunks.length === 0){
        return NextResponse.json(
            { error: "Question or chunks missing!" },
            { status: 400 }
        )
    }

    const chunkEmbeddings = await embedChunks(chunks)

    if (chunkEmbeddings.length !== chunks.length) {
        return NextResponse.json(
          { error: "Failed to embed all chunks" },
          { status: 500 }
        )
    }
    
    const embeddedChunks: EmbeddedChunk[] = []
    chunks.forEach((text, i) => {
        const embedding = chunkEmbeddings[i]
        if (embedding) {
            embeddedChunks.push({ text, embedding })
        }
    })


    const questionEmbedding = await embedQuery(question)

    const scored = embeddedChunks.map((chunk)=> ({
        text: chunk.text,
        score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))

    console.log(
        scored
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((c, i) => ({
            rank: i + 1,
            score: c.score,
            preview: c.text.slice(0, 80),
        }))
    )


    const topChunks = scored
        .sort((a: {score: number}, b: {score: number}) => b.score - a.score)
        .slice(0, 3)
        .map((c: {text: string}) => c.text)

        
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


    try{
        const ai = new GoogleGenAI({})
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return NextResponse.json({
            success: true,
            answer: response.text,
        })
    }catch(error){
        return NextResponse.json(
            { error: "Failed to Answer Question"},
            { status: 500 }
        )
    }
}