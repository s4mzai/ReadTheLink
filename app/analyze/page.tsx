"use client"
import { Text } from "@/components/retroui/Text"
import { isValidUrl } from "@/lib/isValidUrl"
import axios from "axios"
import { redirect, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function Page(){
    const searchParams = useSearchParams()
    const url = searchParams.get("url")
    const [ loading, setLoading ] = useState(false)
    const [error, setError] = useState("")
    const [html, setHtml] = useState("")

    if(!url || !isValidUrl(url)) redirect("/")
    
    useEffect(()=>{
        const fetchHtml = async ()=>{
            try{
                setLoading(true)
                
                const res = await axios.post("/api/fetch-page",{
                    url,
                })
                setHtml(res.data.html)
            } catch{
                setError("Failed to analyze Page")
            } finally{
                setLoading(false)
            }
        }
        fetchHtml()
    },[url])
    

    return(
        <div className="flex flex-col items-center justify-center pt-20 w-full gap-5">
            <div className="flex gap-2 items-center">
                <Text as="h5">Url:</Text>
                <Text as={"p"}>{url}</Text>
            </div>
            <div className="flex justify-center ">
                {loading && (
                    <Text as={"h4"}>Fetching Html</Text>
                )}
                {error && (
                    <Text as={"p"} className="text-red-500">There's a error fetching html</Text>
                )}
                {html && (
                    <div className="flex w-[50%] gap-5">
                        <Text as={"h4"}>Html: </Text>
                        <Text as={"p"}>{html}</Text>
                    </div>
                )}
            </div>
        </div>
    )
}