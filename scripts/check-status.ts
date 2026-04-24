import "dotenv/config"
import path from "path"
import fs from "fs"

const envPath = path.join(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath })
}

import { prisma } from "../src/lib/prisma"

async function checkStatus() {
  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { source: { startsWith: "BIBLE_" } },
        { source: "BRANHAM" },
        { source: "BRANHAM_STUDY" },
        { source: "THEMESSAGE_TRACT" }
      ]
    },
    select: {
      title: true,
      source: true,
      indexed: true,
      fileSize: true
    },
    orderBy: {
      source: "asc"
    }
  })

  console.log("\n📊 Document Indexation Status:\n")
  documents.forEach(doc => {
    const status = doc.indexed ? "✅" : "❌"
    console.log(`${status} ${doc.source.padEnd(15)} | ${doc.title}`)
  })
  console.log(`\nTotal: ${documents.length} documents`)
}

checkStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
