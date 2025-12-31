"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"

import { isValidUrl } from "@/lib/isValidUrl"
import { Text } from "@/components/retroui/Text"

import { PageHeader } from "@/components/analyze/PageHeader"
import { PageContent } from "@/components/analyze/PageContent"
import { SummaryPanel } from "@/components/analyze/SummaryPanel"
import { QuestionBox } from "@/components/analyze/QuestionBox"
import { AnswerPanel } from "@/components/analyze/AnswerPanel"

export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url")

  // page fetch state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // page data
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [contentLength, setContentLength] = useState<number>()

  // summary state
  const [summary, setSummary] = useState("")
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState("")

  // question / answer state
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [answerError, setAnswerError] = useState("")

  // validate URL + fetch page
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

  // generate summary
  const generateSummary = async () => {
    const contentToSend =
      content.length > 8000 ? content.slice(0, 8000) : content

    try {
      setSummaryError("")
      setLoadingSummary(true)

      const res = await axios.post("/api/summarize", {
        title,
        content: contentToSend,
      })

      setSummary(res.data.summary)
    } catch {
      setSummaryError("Failed to summarize page")
    } finally {
      setLoadingSummary(false)
    }
  }

  // ask question
  const askQuestion = async () => {
    if (!question.trim()) return

    const contentToSend =
      content.length > 8000 ? content.slice(0, 8000) : content

    try {
      setAnswerError("")
      setAnswer("")
      setLoadingAnswer(true)

      const res = await axios.post("/api/ask", {
        title,
        content: contentToSend,
        question,
      })

      setAnswer(res.data.answer)
    } catch {
      setAnswerError("Failed to answer question")
    } finally {
      setLoadingAnswer(false)
    }
  }

  return (
    <div className="flex flex-col w-full items-center min-h-dvh gap-10 py-10">

      {url && <PageHeader url={url} />}

      {loading && (
        <div className="flex justify-center">
          <Text as="h4">Fetching page…</Text>
        </div>
      )}

      {error && (
        <div className="flex justify-center">
          <Text as="p" className="text-red-500">
            {error}
          </Text>
        </div>
      )}

      {!loading && !error && content && (
        <>
          <div className="flex flex-col sm:flex-row gap-6 w-full px-4 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 w-full sm:w-[60%]">
              <PageContent
                title={title}
                content={content}
                contentLength={contentLength}
              />
            </div>

            <div className="flex flex-col gap-5 w-full sm:w-[40%] items-center justify-center">
              <SummaryPanel
                summary={summary}
                loading={loadingSummary}
                error={summaryError}
                onGenerate={generateSummary}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full bg-white py-12 px-4">
            <QuestionBox
              question={question}
              loading={loadingAnswer}
              onChange={setQuestion}
              onAsk={askQuestion}
            />

            {answerError && (
              <div className="text-red-500">{answerError}</div>
            )}

            <div className="w-full max-w-[640px]">
              <AnswerPanel answer={answer} loading={loadingAnswer} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
