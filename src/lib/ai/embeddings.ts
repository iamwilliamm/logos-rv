import { embeddingModel } from "./gemini"

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw new Error("Failed to generate embedding")
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = await Promise.all(
      texts.map((text) => generateEmbedding(text))
    )
    return embeddings
  } catch (error) {
    console.error("Error generating embeddings:", error)
    throw new Error("Failed to generate embeddings")
  }
}
