import { generateGroqAnswer } from "./groq"
import { SearchResult } from "./search"

export async function generateAnswer(
  query: string,
  context: SearchResult[]
): Promise<string> {
  try {
    const contextData = context.map((result) => ({
      title: result.metadata.title,
      source: result.metadata.source,
      content: result.metadata.content,
      chunkIndex: result.metadata.chunkIndex,
    }))

    return await generateGroqAnswer(query, contextData)
  } catch (error) {
    console.error("Error generating answer:", error)
    throw new Error("Failed to generate answer")
  }
}
