import { fetchFullBible, BIBLE_IDS } from "../src/lib/bible/api"
import { indexDocument } from "../src/lib/ai/indexation"
import { prisma } from "../src/lib/prisma"

async function indexBibles() {
  console.log("🚀 Starting Bible indexation...")

  const bibles = [
    { name: "Bible Darby", id: BIBLE_IDS.DARBY, source: "BIBLE_DARBY" },
    { name: "Bible Segond 1910", id: BIBLE_IDS.SEGOND, source: "BIBLE_SEGOND" },
    { name: "Bible Martin 1744", id: BIBLE_IDS.MARTIN, source: "BIBLE_MARTIN" },
  ]

  for (const bible of bibles) {
    try {
      console.log(`\n📖 Processing ${bible.name}...`)

      // Fetch full Bible text
      const content = await fetchFullBible(bible.name, bible.id)

      console.log(`✅ Fetched ${content.length} characters`)

      // Create document in database
      const document = await prisma.document.create({
        data: {
          title: bible.name,
          source: bible.source,
          content,
          fileType: "api",
          fileSize: content.length,
          indexed: false,
        },
      })

      // Index document
      console.log(`🔄 Indexing ${bible.name}...`)
      await indexDocument(document.id, bible.name, bible.source, content)

      console.log(`✅ Successfully indexed ${bible.name}`)
    } catch (error: any) {
      console.error(`❌ Failed to index ${bible.name}:`, error.message)
    }
  }

  console.log("\n✅ Bible indexation completed!")
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
