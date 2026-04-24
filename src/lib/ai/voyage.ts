import { VoyageAIClient } from "voyageai"

let voyageClient: VoyageAIClient | null = null

function initializeVoyage() {
  if (voyageClient) return

  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    throw new Error("VOYAGE_API_KEY is not defined")
  }

  voyageClient = new VoyageAIClient({ apiKey })
}

export function getVoyageClient() {
  initializeVoyage()
  return voyageClient!
}
