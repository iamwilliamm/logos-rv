import "dotenv/config"
import fs from "fs"
import path from "path"

const envPath = path.join(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath })
}

import { indexDocument } from "../src/lib/ai/indexation"
import { prisma } from "../src/lib/prisma"

const SEGOND_FILE = path.join(__dirname, "../data/bibles/segond.txt")

async function indexSegond() {
  console.log("🚀 Starting Segond indexation...")

  const content = fs.readFileSync(SEGOND_FILE, "utf-8")
  console.log(`📄 File size: ${content.length} characters`)

  let document = await prisma.document.findFirst({
    where: {
      title: "Bible Louis Segond",
      source: "BIBLE_SEGOND"
    }
  })

  if (!document) {
    document = await prisma.document.create({
      data: {
        title: "Bible Louis Segond",
        source: "BIBLE_SEGOND",
        content,
        fileType: "txt",
        fileSize: Buffer.byteLength(content, "utf-8"),
        indexed: false
      }
    })
  } else {
    document = await prisma.document.update({
      where: { id: document.id },
      data: {
        content,
        fileSize: Buffer.byteLength(content, "utf-8"),
        indexed: false
      }
    })
  }

  console.log(`\n📖 Indexing Segond...`)
  await indexDocument(document.id, document.title, "BIBLE_SEGOND", content)
  
  console.log("\n✅ Segond indexation complete!")
}

indexSegond()
  .then(() => {
    console.log("\n🎉 Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Error:", error)
    process.exit(1)
  })
