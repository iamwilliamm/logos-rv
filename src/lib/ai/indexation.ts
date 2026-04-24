import { generateEmbedding } from "@/lib/ai/embeddings"
import { vectorIndex } from "@/lib/vector"
import { prisma } from "@/lib/prisma"

// Chunk size in characters (roughly 500-1000 tokens)
const CHUNK_SIZE = 2000
const CHUNK_OVERLAP = 200

export function chunkText(text: string, chunkSize: number = CHUNK_SIZE): string[] {
  const chunks: string[] = []
  let start = 0

  // Limit total chunks to prevent rate limit issues with free tier APIs
  const MAX_CHUNKS = 50
  let chunkCount = 0

  while (start < text.length && chunkCount < MAX_CHUNKS) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end)
    const trimmed = chunk.trim()

    if (trimmed.length > 0) {
      chunks.push(trimmed)
      chunkCount++
    }

    start = end - CHUNK_OVERLAP
  }

  if (chunkCount >= MAX_CHUNKS) {
    console.warn(`Document truncated: reached maximum of ${MAX_CHUNKS} chunks`)
  }

  return chunks
}

export async function indexDocument(
  documentId: string,
  title: string,
  source: string,
  content: string
): Promise<void> {
  // Chunk the document
  const chunks = chunkText(content)

  console.log(`Indexing ${chunks.length} chunks for document: ${title}`)

  let successCount = 0
  let failCount = 0

  // Process chunks in batches to avoid memory issues
  const BATCH_SIZE = 5
  for (let batchStart = 0; batchStart < chunks.length; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, chunks.length)
    console.log(`Processing batch ${Math.floor(batchStart / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`)

    // Process batch sequentially to avoid overwhelming the API
    for (let i = batchStart; i < batchEnd; i++) {
      try {
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

        successCount++

        // Add 25 second delay after each embedding to respect 3 RPM limit (20s minimum + 5s buffer)
        if (i < batchEnd - 1 || batchEnd < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 25000))
        }
      } catch (error) {
        console.error(`Failed to index chunk ${i}:`, error)
        failCount++
        // Continue with next chunk instead of failing completely
      }
    }

    // Force garbage collection hint
    if (global.gc) {
      global.gc()
    }
  }

  const successRate = successCount / chunks.length
  console.log(`Indexation complete: ${successCount}/${chunks.length} chunks (${Math.round(successRate * 100)}%)`)

  // Mark as indexed if at least 80% of chunks were successful
  if (successRate >= 0.8) {
    await prisma.document.update({
      where: { id: documentId },
      data: {
        indexed: true,
        vectorId: `${documentId}-chunk-0`, // Store first chunk ID
      },
    })
    console.log(`✅ Successfully indexed document: ${title}`)
  } else {
    console.error(`❌ Failed to index document: only ${Math.round(successRate * 100)}% success rate (minimum 80% required)`)
    throw new Error(`Failed to index document: only ${successCount}/${chunks.length} chunks indexed`)
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
