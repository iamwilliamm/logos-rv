import "dotenv/config"
import fs from "fs"
import path from "path"

const envPath = path.join(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath })
}

import { parseBranhamDocument } from "../src/lib/parsers/branham-parser"
import { generateEmbedding } from "../src/lib/ai/embeddings"
import { vectorIndex } from "../src/lib/vector"
import { prisma } from "../src/lib/prisma"

const BRANHAM_FILE = "/mnt/c/Users/hp/Documents/Prédication WMB/Grenier du message/Le Grenier du Message.txt"

async function reindexBranham() {
  console.log("🚀 Starting Branham reindexation with paragraph parsing...")

  // Read file
  const content = fs.readFileSync(BRANHAM_FILE, "utf-8")
  console.log(`📄 File size: ${content.length} characters`)

  // Parse paragraphs
  console.log("📖 Parsing paragraphs...")
  const allParagraphs = parseBranhamDocument(content)
  console.log(`✅ Found ${allParagraphs.length} paragraphs`)

  // Limit to first 1000 paragraphs for testing
  const paragraphs = allParagraphs.slice(0, 1000)
  console.log(`📊 Limiting to ${paragraphs.length} paragraphs for indexation`)

  if (paragraphs.length === 0) {
    console.error("❌ No paragraphs found! Check parser logic.")
    return
  }

  // Show sample
  console.log("\n📝 Sample paragraph:")
  console.log(JSON.stringify(paragraphs[0], null, 2))

  // Get or create document
  let document = await prisma.document.findFirst({
    where: {
      title: "Le Grenier du Message",
      source: "BRANHAM"
    }
  })

  if (!document) {
    document = await prisma.document.create({
      data: {
        title: "Le Grenier du Message",
        source: "BRANHAM",
        content,
        fileType: "txt",
        fileSize: Buffer.byteLength(content, "utf-8"),
        indexed: false
      }
    })
  }

  console.log(`\n🔄 Indexing ${paragraphs.length} paragraphs...`)
  
  let successCount = 0
  let failCount = 0
  const BATCH_SIZE = 5

  for (let i = 0; i < paragraphs.length; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE, paragraphs.length)
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(paragraphs.length / BATCH_SIZE)}`)

    for (let j = i; j < batchEnd; j++) {
      const para = paragraphs[j]
      
      try {
        const embedding = await generateEmbedding(para.content)
        const vectorId = `${document.id}-para-${j}`

        await vectorIndex.upsert({
          id: vectorId,
          vector: embedding,
          metadata: {
            documentId: document.id,
            title: para.sermonTitle,
            source: "BRANHAM",
            content: para.content,
            chunkIndex: para.paragraphNumber,
            sermonDate: para.sermonDate
          }
        })

        successCount++

        // Delay between requests
        if (j < batchEnd - 1 || batchEnd < paragraphs.length) {
          await new Promise(resolve => setTimeout(resolve, 25000))
        }
      } catch (error) {
        console.error(`Failed to index paragraph ${j}:`, error)
        failCount++
      }
    }

    if (global.gc) {
      global.gc()
    }
  }

  const successRate = successCount / paragraphs.length
  console.log(`\n📊 Indexation complete: ${successCount}/${paragraphs.length} paragraphs (${Math.round(successRate * 100)}%)`)

  if (successRate >= 0.8) {
    await prisma.document.update({
      where: { id: document.id },
      data: {
        indexed: true,
        vectorId: `${document.id}-para-0`
      }
    })
    console.log(`✅ Successfully indexed document`)
  } else {
    console.error(`❌ Failed: only ${Math.round(successRate * 100)}% success rate`)
  }
}

reindexBranham()
  .then(() => {
    console.log("\n🎉 Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Error:", error)
    process.exit(1)
  })
