import { Card } from "@/components/retroui/Card"

export function PageContent({
  title,
  content,
  contentLength,
}: {
  title: string
  content: string
  contentLength?: number
}) {
  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{title || "Untitled page"}</Card.Title>
          <Card.Description>
            Content length: {contentLength} characters
          </Card.Description>
        </Card.Header>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Full content</Card.Title>
        </Card.Header>
        <div className="px-6 pb-6">
          <div className="max-h-[250px] overflow-auto">
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}
