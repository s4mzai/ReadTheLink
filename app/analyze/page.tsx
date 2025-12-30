"use client"
import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Text } from "@/components/retroui/Text"
import { isValidUrl } from "@/lib/isValidUrl"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function Page(){
    const searchParams = useSearchParams()
    const url = searchParams.get("url")
    const [ loading, setLoading ] = useState(false)
    const [error, setError] = useState("")
    const [summaryError, setSummaryError] = useState("")
    const [ title, setTitle ] = useState("")
    const [ summary, setSummary ] = useState("")
    const [content, setContent] = useState("")
    const [ contentLength, setContentLength ] = useState<number>()
    const [ loadingSummary, setLoadingSummary ] = useState(false)
    const router = useRouter()
    
    
    useEffect(()=>{
        if(!url || !isValidUrl(url)) router.replace("/")

        const fetchPage = async ()=>{
            try{
                setLoading(true)
                
                const res = await axios.post("/api/fetch-page",{ url,})
                const result = res.data.result

                setTitle(result.title)
                setContent(result.content)
                setContentLength(result.length)
            } catch{
                setError("Failed to fetch Page")
            } finally{
                setLoading(false)
            }
        }
        fetchPage()
    },[url,router])
    
    const generateSummary = async () => {
        const contentToSend = content.length > 8000? content.slice(0,8000):content
        try{
            setSummaryError("")
            setLoadingSummary(true)
            const res = await axios.post("/api/summarize",{title,content:contentToSend})
            setSummary(res.data.summary)
        }catch{
            setSummaryError("Failed to summarize page")
        }finally{
            setLoadingSummary(false)
        }
    }
    

    return(
        <div className="flex flex-col items-center justify-center pt-20 w-full gap-5 py-10 ">
            <div className="flex gap-2 items-center">
                <Text as="h5">Url:</Text>
                <Text as={"p"}>{url}</Text>
            </div>
            <div className="w-full max-w-7xl px-4">
                {loading && (
                    <div className="flex justify-center">
                        <Text as="h4">Fetching page…</Text>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <Text as="p" className="text-red-500">{error}</Text>
                    </div>
                )}

                {!loading && !error && content && (
                    <div className="flex flex-col sm:flex-row w-full gap-6">
                        <div className="gap-6 flex flex-col w-full sm:w-[60%]">
                            <Card>
                                <Card.Header>
                                    <Card.Title>{title || "Untitled page"}</Card.Title>
                                    <Card.Description>
                                        Content length: {contentLength} characters
                                    </Card.Description>
                                </Card.Header>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Card.Title>Full content</Card.Title>
                                </Card.Header>
                                <div className="px-6 pb-6">
                                    <div className="max-h-[250px] overflow-auto">
                                        <p className="whitespace-pre-line text-sm leading-relaxed">
                                            {content}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                        </div>
                        <div className="sm:w-[40%] flex items-center justify-center flex-col gap-5">
                            {summaryError && <div className="text-red-500">{summaryError}</div>}
                            {summary && (
                                <Card className="max-h-[400px] overflow-auto">
                                    <Card.Header>
                                        <Card.Title>Summary</Card.Title>
                                        <Card.Description className="leading-relaxed">
                                            {summary}
                                        </Card.Description>
                                    </Card.Header>
                                </Card>
                            )} 
                            {!summary && (
                                <Button 
                                onClick={()=>generateSummary()}
                                disabled={loadingSummary}
                                className={`flex items-center justify-center w-full sm:w-fit h-fit${
                                    loadingSummary
                                      ? " cursor-not-allowed"
                                      : ""
                                }`}
                            
                                >{loadingSummary?"Generating Summary...":"Summary!"}</Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}