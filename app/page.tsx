"use client"

import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [ inputUrl, setInputUrl ] = useState<string>("")
  const router = useRouter()
  return (
    <div className="border flex flex-col justify-center h-dvh gap-10 p-4" >
      <div className="flex flex-col items-center mb-10 sm:mb-25 gap-10">
        <div className="text-center flex flex-col gap-5">
          <Text className="block sm:hidden" as={"h2"}>Make Webpages Make Sense</Text>
          <Text className="hidden sm:block" as={"h1"}>Make Webpages Make Sense</Text>
          <div>
            <Text as={"p"} className="text-sm sm:text-base">We read the page so you don’t have to.</Text>
            <Text as={"p"} className="text-sm sm:text-base">Paste a link and let us break it down into a summary you can actually understand.</Text>
          </div>
        </div>
        <div className="flex gap-5 w-full sm:w-[600px] flex-col sm:flex-row">
          <Input
          onChange={(e)=>{setInputUrl(e.target.value)}}
          value={inputUrl}
          onKeyDown={(e)=>{
            if(e.key === "Enter") {
              router.push(`/analyze?url=${inputUrl}`)
              setInputUrl("")
            }

          }}
          type="text" 
          placeholder="https://localhost:3000" />
          <Button
          type="submit"
          onClick={()=>{
            router.push(`/analyze?url=${inputUrl}`)
            setInputUrl("")
          }} 
          className="flex items-center justify-center text-center">Ask!</Button>
        </div>
      </div>
    </div>
  );
}
