type CachedPage = {
    title: string
    content: string
    length: number
    chunks: string[]
  }
  
  const pageCache = new Map<string, CachedPage>()
  
  export function getCachedPage(url: string) {
    return pageCache.get(url)
  }
  
  export function setCachedPage(url: string, data: CachedPage) {
    pageCache.set(url, data)
  }
  