import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { prisma } from "../src/lib/prisma"
import { generateEmbedding } from "../src/lib/ai/embeddings"
import { vectorIndex } from "../src/lib/vector"

interface BranhamPage {
  title: string
  url: string
  slug: string
}

const PAGES: BranhamPage[] = [
  {
    title: "William Branham",
    url: "https://branham.org/fr/williambranham",
    slug: "william-branham"
  },
  {
    title: "Joseph Branham",
    url: "https://branham.org/fr/josephbranham",
    slug: "joseph-branham"
  },
  {
    title: "Billy Paul Branham",
    url: "https://branham.org/fr/billypaulbranham",
    slug: "billy-paul-branham"
  },
  {
    title: "À propos de nous",
    url: "https://branham.org/fr/aboutus",
    slug: "about-us"
  },
  {
    title: "WBEA - William Branham Evangelistic Association",
    url: "https://branham.org/fr/wbea",
    slug: "wbea"
  },
  {
    title: "Documents",
    url: "https://branham.org/fr/documents",
    slug: "documents"
  }
]

async function fetchPageContent(url: string): Promise<string> {
  const response = await fetch(url)
  const html = await response.text()

  // Extract text content from HTML
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  // Convert block-level elements to newlines to preserve paragraph structure
  text = text.replace(/<\/?(p|div|br|h[1-6]|li|tr|blockquote|section|article)[^>]*>/gi, '\n')

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Decode common HTML entities
  text = text.replace(/&nbsp;/gi, ' ')
  text = text.replace(/&amp;/gi, '&')
  text = text.replace(/&lt;/gi, '<')
  text = text.replace(/&gt;/gi, '>')
  text = text.replace(/&quot;/gi, '"')
  text = text.replace(/&#39;/gi, "'")
  text = text.replace(/&rsquo;/gi, "'")
  text = text.replace(/&lsquo;/gi, "'")
  text = text.replace(/&rdquo;/gi, '"')
  text = text.replace(/&ldquo;/gi, '"')
  text = text.replace(/&hellip;/gi, '...')

  // Clean up: collapse multiple spaces on the same line, but preserve newlines
  text = text.replace(/[ \t]+/g, ' ')
  // Collapse 3+ newlines into double newline (paragraph break)
  text = text.replace(/\n{3,}/g, '\n\n')
  // Remove leading/trailing whitespace per line
  text = text.split('\n').map(line => line.trim()).join('\n')
  text = text.trim()

  return text
}

function chunkText(text: string, maxLength: number = 1000, overlap: number = 150): string[] {
  const chunks: string[] = []

  // Step 1: Split into paragraphs first (double newline or multiple spaces that look like paragraph breaks)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  // If no paragraph breaks found (HTML content flattened), use sentence-based splitting
  const textBlocks = paragraphs.length > 1 ? paragraphs : [text]

  let currentChunk = ""

  for (const block of textBlocks) {
    // Step 2: Split block into complete sentences (keeping punctuation attached)
    const sentences = block.match(/[^.!?]*[.!?]+[\s]*/g) || [block]

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence || trimmedSentence.length < 3) continue

      if ((currentChunk + " " + trimmedSentence).length > maxLength && currentChunk.length > 0) {
        // Save current chunk
        chunks.push(currentChunk.trim())

        // Start new chunk with overlap: take the last few sentences from the previous chunk
        const overlapText = getOverlapText(currentChunk, overlap)
        currentChunk = overlapText ? overlapText + " " + trimmedSentence : trimmedSentence
      } else {
        currentChunk = currentChunk
          ? currentChunk + " " + trimmedSentence
          : trimmedSentence
      }
    }

    // Add a paragraph separator to maintain structure
    if (currentChunk && !currentChunk.endsWith("\n")) {
      currentChunk += " "
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }

  // Filter out chunks that are too short to be meaningful
  return chunks.filter(chunk => chunk.length >= 50)
}

function getOverlapText(text: string, maxOverlap: number): string {
  // Extract the last portion of text up to maxOverlap characters, ending at a sentence boundary
  if (text.length <= maxOverlap) return text

  const tail = text.slice(-maxOverlap)
  // Find the first sentence boundary in the tail
  const sentenceStart = tail.search(/[.!?]\s+/)
  if (sentenceStart !== -1) {
    return tail.slice(sentenceStart + 1).trim()
  }
  return tail.trim()
}

async function indexPages() {
  console.log("🚀 Starting Branham.org Pages indexation...\n")

  for (const page of PAGES) {
    console.log(`📄 Processing: ${page.title}`)

    try {
      // Check if already indexed
      const existing = await prisma.document.findFirst({
        where: {
          source: "BRANHAM_STUDY",
          title: page.title
        }
      })

      if (existing?.indexed) {
        console.log(`   ✅ Already indexed, skipping\n`)
        continue
      }

      // Fetch content
      console.log(`   📥 Fetching content from ${page.url}`)
      const content = await fetchPageContent(page.url)

      // Chunk content
      const chunks = chunkText(content, 800)
      console.log(`   📦 Split into ${chunks.length} chunks`)

      // Create or update document
      const document = await prisma.document.upsert({
        where: {
          id: existing?.id || `branham-page-${page.slug}`
        },
        create: {
          id: `branham-page-${page.slug}`,
          title: page.title,
          source: "BRANHAM_STUDY",
          content: content,
          fileSize: content.length,
          fileType: "html",
          indexed: false,
          metadata: JSON.stringify({
            url: page.url,
            slug: page.slug,
            totalChunks: chunks.length,
            type: "about"
          })
        },
        update: {
          content: content,
          fileSize: content.length,
          metadata: JSON.stringify({
            url: page.url,
            slug: page.slug,
            totalChunks: chunks.length,
            type: "about"
          })
        }
      })

      // Index chunks
      let successCount = 0
      let failCount = 0

      for (let i = 0; i < chunks.length; i++) {
        try {
          const chunk = chunks[i]

          // Generate embedding
          const embedding = await generateEmbedding(chunk)

          // Store in vector DB
          await vectorIndex.upsert([{
            id: `${document.id}-chunk-${i}`,
            vector: embedding,
            metadata: {
              documentId: document.id,
              source: "BRANHAM_STUDY",
              title: page.title,
              content: chunk,
              chunkIndex: i,
              url: page.url
            }
          }])

          successCount++

          if ((i + 1) % 5 === 0) {
            console.log(`   ⏳ Progress: ${i + 1}/${chunks.length} chunks`)
          }
        } catch (error) {
          console.error(`   ❌ Failed chunk ${i}:`, error)
          failCount++
        }
      }

      // Mark as indexed if success rate > 80%
      const successRate = (successCount / chunks.length) * 100
      const indexed = successRate >= 80

      await prisma.document.update({
        where: { id: document.id },
        data: { indexed }
      })

      console.log(`   ✅ Indexed: ${successCount}/${chunks.length} chunks (${successRate.toFixed(1)}%)`)
      console.log(`   ${indexed ? '✅' : '⚠️'} Status: ${indexed ? 'INDEXED' : 'PARTIAL'}\n`)

    } catch (error) {
      console.error(`   ❌ Error processing ${page.title}:`, error)
      console.log()
    }
  }

  console.log("✅ Branham.org Pages indexation completed!")
}

// Run
indexPages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
