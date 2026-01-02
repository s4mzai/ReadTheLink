import { Suspense } from "react"
import AnalyzeClient from "./AnalyzeClient"

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <AnalyzeClient />
    </Suspense>
  )
}
