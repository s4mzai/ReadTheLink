
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    const body = await req.json()
    const { title, content } = body
    
    if(!title || !content){ 
        return NextResponse.json(
            { error: "Title or Content is missing!" },
            { status: 400 }
        )
    }
    const safeContent = content.length > 8000 ? content.slice(0, 8000) : content

    const prompt = `
    You are given the content of a webpage.

    Title:
    ${title}

    Content:
    ${safeContent}

    Task:
    Write a clear, concise summary of this webpage in simple language.
    Focus only on what is explicitly stated in the content.
    Do not add external information.
    Do not speculate.

    Summary:

    `
    // TODO: INFRONTEND SLICE THE CONTENT 
    try{

        const ai = new GoogleGenAI({});

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return NextResponse.json({
            success:true,
            summary: response.text,
        })
    }catch(error){
        return NextResponse.json(
            { error: "Failed to summarize page" },
            { status: 500 } 
        )
    }
}