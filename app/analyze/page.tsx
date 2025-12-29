"use client"
import { Text } from "@/components/retroui/Text"
import { useSearchParams } from "next/navigation"


export default function Page(){
    const searchParams = useSearchParams()
    const value = searchParams.get("url")

    return(
        <div className="flex items-center justify-center pt-20 gap-2 w-full">
            <Text as="h5">Url:</Text>
            <Text as={"p"}>{value}</Text>
        </div>
    )
}