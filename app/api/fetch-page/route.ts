import { chunkText } from "@/lib/chunkText"
import { extractReadableText } from "@/lib/extractReadableText"
import { isValidUrl } from "@/lib/isValidUrl"
import { getCachedPage, setCachedPage } from "@/lib/pageCache"
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

        const cached = getCachedPage(url)
        if(cached){
            console.log("Using cached page")
            return NextResponse.json({
                success: true,
                result: cached,
            })
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

        const extracted = extractReadableText(html,url)

        if (!extracted) {
            return NextResponse.json(
                { error: "Could not extract readable content" },
                { status: 422 }
            )
        }

        const chunks = chunkText(extracted.content || "")

        const result = {
            title: extracted.title || "",
            content: extracted.content || "",
            length: extracted.length || 0,
            chunks,
        }

        setCachedPage(url,result)
        console.log("Fetched and cached page")

        return NextResponse.json({
            success:true,
            result,
        })
    }catch (error:any){

        if(error.response?.status === 403){
            console.log(error)
            return NextResponse.json(
                {error: "This website blocks automated access. try refreshing it several times."},
                {status: 403}
            )
        }
        console.log(error)
        return NextResponse.json(
            { error: "Failed to fetch page" },
            { status: 500 } 
        )
    }

    
}