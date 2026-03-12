import { vectorIndex } from "@/lib/vector"
import { generateEmbedding } from "./embeddings"

export interface SearchResult {
  id: string
  score: number
  metadata: {
    title: string
    source: string
    content: string
  }
}

export async function searchVectors(
  query: string,
  topK: number = 10
): Promise<SearchResult[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // Search in vector database
    const results = await vectorIndex.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    })

    return results.map((result) => ({
      id: String(result.id),
      score: result.score,
      metadata: {
        title: result.metadata?.title as string || "",
        source: result.metadata?.source as string || "",
        content: result.metadata?.content as string || "",
      },
    }))
  } catch (error) {
    console.error("Error searching vectors:", error)
    throw new Error("Failed to search vectors")
  }
}
