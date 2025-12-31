import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { isValidUrl } from "@/lib/isValidUrl"

export function usePageContent(url: string | null) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [contentLength, setContentLength] = useState<number>()

  useEffect(() => {
    if (!url || !isValidUrl(url)) {
      router.replace("/")
      return
    }

    const fetchPage = async () => {
      try {
        setLoading(true)
        const res = await axios.post("/api/fetch-page", { url })
        const result = res.data.result

        setTitle(result.title)
        setContent(result.content)
        setContentLength(result.length)
      } catch {
        setError("Failed to fetch page")
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [url, router])

  return {
    loading,
    error,
    title,
    content,
    contentLength,
  }
}
