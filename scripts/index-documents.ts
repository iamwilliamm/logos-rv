import fs from "fs"
import path from "path"
import { parseDocument } from "../src/lib/parsers/document-parser"
import { indexDocument } from "../src/lib/ai/indexation"
import { prisma } from "../src/lib/prisma"

// WSL paths (Windows C: drive is mounted at /mnt/c)
const BRANHAM_DIR = "/mnt/c/Users/hp/Documents/Prédication WMB/Grenier du message"
const PASTOR_DIR = "/mnt/c/Users/hp/Documents/Predications_Pasteur PIERRE ESSOH YAO"

async function indexAllDocuments() {
  console.log("🚀 Starting bulk indexation...")

  // Index Branham sermons
  console.log("\n📖 Indexing Branham sermons...")
  await indexDirectory(BRANHAM_DIR, "BRANHAM")

  // Index Pastor sermons
  console.log("\n📖 Indexing Pastor sermons...")
  await indexDirectory(PASTOR_DIR, "PASTOR")

  console.log("\n✅ Bulk indexation completed!")
}

async function indexDirectory(dirPath: string, source: string) {
  try {
    const files = fs.readdirSync(dirPath)
    let indexed = 0
    let failed = 0

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // Recursively index subdirectories
        await indexDirectory(filePath, source)
        continue
      }

      const ext = path.extname(file).toLowerCase().slice(1)
      if (!["txt", "pdf", "doc", "docx", "ppt", "pptx"].includes(ext)) {
        console.log(`⏭️  Skipping ${file} (unsupported format)`)
        continue
      }

      try {
        console.log(`📄 Processing: ${file}`)

        // Read file
        const buffer = fs.readFileSync(filePath)

        // Parse document
        const content = await parseDocument(buffer, ext)

        if (!content || content.trim().length === 0) {
          console.log(`⚠️  Empty content: ${file}`)
          failed++
          continue
        }

        // Create document in database
        const document = await prisma.document.create({
          data: {
            title: path.basename(file, path.extname(file)),
            source,
            content,
            fileType: ext,
            fileSize: buffer.length,
            indexed: false,
          },
        })

        // Index document
        await indexDocument(document.id, document.title, source, content)

        console.log(`✅ Indexed: ${file}`)
        indexed++
      } catch (error: any) {
        console.error(`❌ Failed to index ${file}:`, error.message)
        failed++
      }
    }

    console.log(`\n📊 ${source} - Indexed: ${indexed}, Failed: ${failed}`)
  } catch (error: any) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message)
  }
}

// Run indexation
indexAllDocuments()
  .then(() => {
    console.log("\n🎉 All done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error)
    process.exit(1)
  })
