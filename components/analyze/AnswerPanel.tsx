import { Card } from "@/components/retroui/Card"
import { TextShimmer } from "../motion-primitives/text-shimmer"
import { TypingAnimation } from "../ui/typing-animation"

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
          <div className="whitespace-pre-line text-sm leading-relaxed">
            {loading
              ? <TextShimmer>Thinking...</TextShimmer>
              : answer
              ? <TypingAnimation
                loop={false} 
                typeSpeed={15}
                className="!leading-relaxed"
              >{answer}</TypingAnimation>
              : "Ask a question to get an answer"}
          </div>
        </div>
      </div>
    </Card>
  )
}
