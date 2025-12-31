import { useState } from "react"
import axios from "axios"

export function useSummary(title: string, content: string) {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSummary = async () => {
    const contentToSend =
      content.length > 8000 ? content.slice(0, 8000) : content

    try {
      setError("")
      setLoading(true)

      const res = await axios.post("/api/summarize", {
        title,
        content: contentToSend,
      })

      setSummary(res.data.summary)
    } catch {
      setError("Failed to summarize page")
    } finally {
      setLoading(false)
    }
  }

  return {
    summary,
    loading,
    error,
    generateSummary,
  }
}
