import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { TextShimmer } from "../motion-primitives/text-shimmer"
import { TypingAnimation } from "../ui/typing-animation"

export function SummaryPanel({
  summary,
  loading,
  error,
  onGenerate,
}: {
  summary: string
  loading: boolean
  error: string
  onGenerate: () => void
}) {
  if (summary) {
    return (
      <Card className=" w-full max-h-[400px] overflow-auto">
        <Card.Header>
          <Card.Title>Summary</Card.Title>
        </Card.Header>
        <div className="px-6 pb-6">
          <div className="max-h-[200px] sm:max-h-[300px] overflow-auto">
            <p className="whitespace-pre-line text-sm leading-relaxed">
              <TypingAnimation 
                loop={false} 
                typeSpeed={15}
                className="!leading-relaxed"
              >
                {summary}
              </TypingAnimation>
            </p>
          </div>
          
        </div>
      </Card>
    )
  }

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <TextShimmer className="text-center font-mono text-sm" duration={1}>
          Generating summary...
        </TextShimmer>
      ) : (
        <Button className="w-full flex justify-center sm:w-fit" onClick={onGenerate}>
          Summary!
        </Button>
      )}  
    </>
  )
}
