import { chatModel } from "./gemini"
import { SearchResult } from "./search"

export async function generateAnswer(
  query: string,
  context: SearchResult[]
): Promise<string> {
  try {
    // Build context from search results
    const contextText = context
      .map((result, index) => {
        return `[${index + 1}] ${result.metadata.title} (${result.metadata.source}):\n${result.metadata.content}\n`
      })
      .join("\n")

    // Create prompt for Gemini
    const prompt = `Tu es un assistant biblique spécialisé dans l'étude des Écritures et des enseignements chrétiens.

Contexte disponible:
${contextText}

Question de l'utilisateur: ${query}

Instructions:
- Réponds en français de manière claire et structurée
- Base ta réponse uniquement sur le contexte fourni
- Cite les références bibliques exactes (livre, chapitre, verset)
- Si le contexte ne contient pas assez d'informations, dis-le clairement
- Reste fidèle aux enseignements bibliques

Réponse:`

    const result = await chatModel.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Error generating answer:", error)
    throw new Error("Failed to generate answer")
  }
}
