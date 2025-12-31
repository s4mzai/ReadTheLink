import { Card } from "@/components/retroui/Card"

export function AnswerPanel({
  answer,
  loading,
}: {
  answer: string
  loading: boolean
}) {
  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Answer</Card.Title>
      </Card.Header>
      <div className="px-6 pb-6">
        <div className="max-h-[250px] overflow-auto">
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {loading
              ? "Thinking..."
              : answer || "Ask a question to get an answer"}
          </p>
        </div>
      </div>
    </Card>
  )
}
