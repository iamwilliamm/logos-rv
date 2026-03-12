import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined")
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Model for embeddings
export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
})

// Model for chat/Q&A
export const chatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})
