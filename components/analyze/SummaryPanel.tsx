import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"

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
      <Card className="max-h-[400px] overflow-auto">
        <Card.Header>
          <Card.Title>Summary</Card.Title>
          <Card.Description className="leading-relaxed">
            {summary}
          </Card.Description>
        </Card.Header>
      </Card>
    )
  }

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      <Button className={`w-full flex justify-center sm:w-fit ${loading?" cursor-not-allowed":""}`} onClick={onGenerate} disabled={loading}>
        {loading ? "Generating Summary..." : "Summary!"}
      </Button>
    </>
  )
}
