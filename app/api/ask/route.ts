import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"


export async function POST(req:Request){
    const body = await req.json()
    const { title, content, question } = body

    if (!title || !content || !question ){
        return NextResponse.json(
            { error: "Somethings missing!" },
            { status: 400 }
        )
    }

    const safeContent = content.length > 8000 ? content.slice(0,8000) : content

    const prompt = `
    You are given the content of a webpage.

    Title:
    ${title}

    Content:
    ${safeContent}

    Question:
    ${question}

    Instructions:
    Answer the question using ONLY the content above.
    If the answer is not explicitly present in the content, respond with:
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