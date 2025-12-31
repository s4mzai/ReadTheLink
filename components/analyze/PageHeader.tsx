import { Text } from "@/components/retroui/Text"

export function PageHeader({ url }: { url: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4">
      <Text as="h5">Url:</Text>
      <Text
        as="p"
        className="break-all sm:break-words text-sm text-muted-foreground"
      >
        {url}
      </Text>
    </div>
  )
}
