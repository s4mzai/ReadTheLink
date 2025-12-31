import { Input } from "@/components/retroui/Input"
import { Button } from "@/components/retroui/Button"

export function QuestionBox({
  question,
  loading,
  onChange,
  onAsk,
}: {
  question: string
  loading: boolean
  onChange: (v: string) => void
  onAsk: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-[600px]">
      <Input
        value={question}
        disabled={loading}
        placeholder="Question goes here..."
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAsk()}
      />
      <Button className="flex justify-center" onClick={onAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask!"}
      </Button>
    </div>
  )
}
