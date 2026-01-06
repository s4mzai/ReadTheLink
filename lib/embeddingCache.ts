type CachedEmbeddings = {
    chunks: string[]
    embeddings: number[][]
  }
  
  const embeddingCache = new Map<string, CachedEmbeddings>()
  
  export function getCachedEmbeddings(key: string) {
    return embeddingCache.get(key)
  }
  
  export function setCachedEmbeddings(
    key: string,
    chunks: string[],
    embeddings: number[][]
  ) {
    embeddingCache.set(key, { chunks, embeddings })
  }
  