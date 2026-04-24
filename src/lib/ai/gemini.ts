import { GoogleGenerativeAI } from "@google/generative-ai"

let genAIInstance: GoogleGenerativeAI | null = null
let embeddingModelInstance: any = null
let chatModelInstance: any = null

function initializeGemini() {
  if (genAIInstance) return

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined")
  }

  genAIInstance = new GoogleGenerativeAI(apiKey)
  // Use gemini-embedding-001 for text embeddings
  embeddingModelInstance = genAIInstance.getGenerativeModel({
    model: "gemini-embedding-001",
  })
  chatModelInstance = genAIInstance.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  })
}

export function getGenAI() {
  initializeGemini()
  return genAIInstance!
}

export function getEmbeddingModel() {
  initializeGemini()
  return embeddingModelInstance
}

export function getChatModel() {
  initializeGemini()
  return chatModelInstance
}

// For backward compatibility
export const genAI = {
  get getGenerativeModel() {
    return getGenAI().getGenerativeModel.bind(getGenAI())
  }
}

export const embeddingModel = {
  embedContent: (text: string, options?: any) => getEmbeddingModel().embedContent(text, options)
}

export const chatModel = {
  generateContent: (prompt: string) => getChatModel().generateContent(prompt)
}
