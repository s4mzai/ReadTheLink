"use client"

import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { isValidUrl } from "@/lib/isValidUrl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [inputUrl, setInputUrl] = useState<string>("")
  const [touched, setTouched] = useState(false)

  const router = useRouter()
  const isValid = isValidUrl(inputUrl)

  const handleSubmit = () => {
    if (!isValid) return
    router.push(`/analyze?url=${encodeURIComponent(inputUrl)}`)
    setInputUrl("")
    setTouched(false)
  }

  return (
    <div className="flex flex-col justify-center h-dvh gap-10 p-4">
      <div className="flex flex-col items-center mb-10 sm:mb-20 gap-10">
        <div className="text-center flex flex-col gap-5">
          <Text className="block sm:hidden" as={"h2"}>Make Webpages Make Sense</Text>
          <Text className="hidden sm:block" as={"h1"}>Make Webpages Make Sense</Text>
          <div>
            <Text as={"p"} className="text-sm sm:text-base">
              We read the page so you don’t have to.
            </Text>
            <Text as={"p"} className="text-sm sm:text-base">
              Paste a link and let us break it down into a summary you can actually understand.
            </Text>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-[600px] flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              value={inputUrl}
              type="text"
              placeholder="https://example.com"
              onChange={(e) => {
                setInputUrl(e.target.value)
                if (!touched) setTouched(true)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`flex items-center justify-center text-center${
              isValid
                ? ""
                : " cursor-not-allowed"
            }`}
          >
            Ask!
          </Button>
        </div>
        {touched && inputUrl && !isValid ? (
          <p className="text-sm text-red-500">
            Please enter a valid URL
          </p>
        ):(
          <div className="h-5">
          </div>
        )}
      </div>
    </div>
  );
}
