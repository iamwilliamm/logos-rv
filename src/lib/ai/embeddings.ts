import { generateOllamaEmbedding } from "./ollama"

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embedding = await generateOllamaEmbedding(text)

    // Ollama nomic-embed-text returns 768 dimensions, pad to 1536
    if (embedding.length < 1536) {
      return [...embedding, ...new Array(1536 - embedding.length).fill(0)]
    }

    return embedding.slice(0, 1536)
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
