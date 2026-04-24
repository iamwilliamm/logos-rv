import "dotenv/config"
import fs from "fs"
import path from "path"

// Load .env.local explicitly
const envPath = path.join(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath })
}

import { indexDocument } from "../src/lib/ai/indexation"
import { prisma } from "../src/lib/prisma"

const BIBLES = [
  { file: "darby.txt", source: "BIBLE_DARBY", title: "Bible Darby (J.N. Darby)" },
  { file: "martin.txt", source: "BIBLE_MARTIN", title: "Bible Martin 1744" },
  { file: "segond.txt", source: "BIBLE_SEGOND", title: "Bible Louis Segond" },
]

async function indexBibles() {
  console.log("🚀 Starting Bible indexation...\n")

  for (const bible of BIBLES) {
    try {
      console.log(`📖 Processing: ${bible.title}`)

      const filePath = path.join(__dirname, "../data/bibles", bible.file)

      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${bible.file}`)
        continue
      }

      // Check if already indexed
      const existing = await prisma.document.findFirst({
        where: {
          title: bible.title,
          source: bible.source,
          indexed: true,
        },
      })

      if (existing) {
        console.log(`⏭️  Already indexed: ${bible.title}\n`)
        continue
      }

      // Read file
      const content = fs.readFileSync(filePath, "utf-8")
      const lines = content.split("\n").filter(l => l.trim())
      console.log(`   Found ${lines.length} verses`)

      // Check if document exists but not indexed, or create new
      let document = await prisma.document.findFirst({
        where: {
          title: bible.title,
          source: bible.source,
        },
      })

      if (document && !document.indexed) {
        // Update existing document
        document = await prisma.document.update({
          where: { id: document.id },
          data: {
            content,
            fileType: "txt",
            fileSize: Buffer.byteLength(content, "utf-8"),
          },
        })
      } else if (!document) {
        // Create new document
        document = await prisma.document.create({
          data: {
            title: bible.title,
            source: bible.source,
            content,
            fileType: "txt",
            fileSize: Buffer.byteLength(content, "utf-8"),
            indexed: false,
          },
        })
      }

      // Index document
      console.log(`   Indexing...`)
      await indexDocument(document.id, document.title, bible.source, content)

      console.log(`✅ Indexed: ${bible.title}\n`)
    } catch (error: any) {
      console.error(`❌ Failed to index ${bible.title}:`, error.message, "\n")
    }
  }

  console.log("✅ Bible indexation completed!")
}

// Run indexation
indexBibles()
  .then(() => {
    console.log("\n🎉 All done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error)
    process.exit(1)
  })
