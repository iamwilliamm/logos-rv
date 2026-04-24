const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text"

export async function generateOllamaEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.embedding
  } catch (error) {
    console.error("Error generating Ollama embedding:", error)
    throw new Error("Failed to generate embedding with Ollama")
  }
}
