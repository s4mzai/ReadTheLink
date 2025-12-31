import { useState } from "react"
import axios from "axios"

export function useQuestionAnswer(title: string, content: string) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const askQuestion = async () => {
    if (!question.trim()) return

    const contentToSend =
      content.length > 8000 ? content.slice(0, 8000) : content

    try {
      setError("")
      setAnswer("")
      setLoading(true)

      const res = await axios.post("/api/ask", {
        title,
        content: contentToSend,
        question,
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
