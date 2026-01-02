"use client"

import { useSearchParams } from "next/navigation"
import { Text } from "@/components/retroui/Text"

import { PageHeader } from "@/components/analyze/PageHeader"
import { PageContent } from "@/components/analyze/PageContent"
import { SummaryPanel } from "@/components/analyze/SummaryPanel"
import { QuestionBox } from "@/components/analyze/QuestionBox"
import { AnswerPanel } from "@/components/analyze/AnswerPanel"

import { usePageContent } from "@/hooks/usePageContent"
import { useSummary } from "@/hooks/useSummary"
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer"

export default function AnalyzeClient() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")

  const {
    loading,
    error,
    title,
    content,
    contentLength,
    chunks,
  } = usePageContent(url)

  const {
    summary,
    loading: loadingSummary,
    error: summaryError,
    generateSummary,
  } = useSummary(title, content)

  const {
    question,
    setQuestion,
    answer,
    loading: loadingAnswer,
    error: answerError,
    askQuestion,
  } = useQuestionAnswer(chunks)

  return (
    <div className="flex flex-col w-full min-h-dvh gap-10 py-10 items-center">
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
              <div>This page was split into {chunks.length} chunks</div>
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

            {answerError && <div className="text-red-500">{answerError}</div>}

            <div className="w-[640px] max-w-full">
              <AnswerPanel answer={answer} loading={loadingAnswer} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
