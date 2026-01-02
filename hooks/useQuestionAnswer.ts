import { useState } from "react"
import axios from "axios"

export function useQuestionAnswer(chunks: string[]) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const askQuestion = async () => {
    if (!question.trim()) return

    if (!chunks || chunks.length === 0) {
      setError("No page content available")
      return
    }

    try {
      setError("")
      setAnswer("")
      setLoading(true)

      const res = await axios.post("/api/ask", {
        question,
        chunks
      })

      setAnswer(res.data.answer)
    } catch {
      setError("Failed to answer question")
    } finally {
      setLoading(false)
    }
  }

  return {
    question,
    setQuestion,
    answer,
    loading,
    error,
    askQuestion,
  }
}
