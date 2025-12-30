import { extractReadableText } from "@/lib/extractReadableText"
import { isValidUrl } from "@/lib/isValidUrl"
import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const body = await req.json()
        const { url } = body

        if(!url || !isValidUrl(url)){
            return NextResponse.json(
                { error: "Invalid Url" },
                { status: 400 }
            )
        }
        
        const response = await axios.get(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              "Accept": "text/html",
            },
            timeout: 10000,
            maxRedirects: 5,
        })

        const html = response.data

        const result = extractReadableText(html,url)

        if (!result) {
            return NextResponse.json(
                { error: "Could not extract readable content" },
                { status: 422 }
            )
        }

        return NextResponse.json({
            success:true,
            result,
        })
    }catch (error){
        return NextResponse.json(
            { error: "Failed to fetch page" },
            { status: 500 } 
        )
    }
}