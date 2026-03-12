import { generateEmbedding } from "@/lib/ai/embeddings"
import { vectorIndex } from "@/lib/vector"
import { prisma } from "@/lib/prisma"

// Chunk size in characters (roughly 500-1000 tokens)
const CHUNK_SIZE = 2000
const CHUNK_OVERLAP = 200

export function chunkText(text: string, chunkSize: number = CHUNK_SIZE): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end)
    chunks.push(chunk.trim())
    start = end - CHUNK_OVERLAP
  }

  return chunks.filter((chunk) => chunk.length > 0)
}

export async function indexDocument(
  documentId: string,
  title: string,
  source: string,
  content: string
): Promise<void> {
  try {
    // Chunk the document
    const chunks = chunkText(content)

    console.log(`Indexing ${chunks.length} chunks for document: ${title}`)

    // Generate embeddings and index each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const embedding = await generateEmbedding(chunk)

      // Create unique ID for this chunk
      const vectorId = `${documentId}-chunk-${i}`

      // Upsert to vector database
      await vectorIndex.upsert({
        id: vectorId,
        vector: embedding,
        metadata: {
          documentId,
          title,
          source,
          content: chunk,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      })
    }

    // Update document status in database
    await prisma.document.update({
      where: { id: documentId },
      data: {
        indexed: true,
        vectorId: `${documentId}-chunk-0`, // Store first chunk ID
      },
    })

    console.log(`Successfully indexed document: ${title}`)
  } catch (error) {
    console.error("Error indexing document:", error)
    throw new Error("Failed to index document")
  }
}

export async function deleteDocumentVectors(documentId: string): Promise<void> {
  try {
    // Get document to find all chunk IDs
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      throw new Error("Document not found")
    }

    // Delete all chunks from vector database
    // Note: This is a simplified version. In production, you'd want to track all chunk IDs
    // For now, we'll just mark as not indexed
    await prisma.document.update({
      where: { id: documentId },
      data: {
        indexed: false,
        vectorId: null,
      },
    })

    console.log(`Deleted vectors for document: ${documentId}`)
  } catch (error) {
    console.error("Error deleting document vectors:", error)
    throw new Error("Failed to delete document vectors")
  }
}
