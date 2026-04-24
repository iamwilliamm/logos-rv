import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { prisma } from "../src/lib/prisma"

async function resetDocuments() {
  console.log("🔄 Resetting indexed status for BRANHAM_STUDY and THEMESSAGE_TRACT documents...\n")

  // Reset BRANHAM_STUDY documents
  const branhamResult = await prisma.document.updateMany({
    where: {
      source: "BRANHAM_STUDY"
    },
    data: {
      indexed: false
    }
  })
  console.log(`   ✅ Reset ${branhamResult.count} BRANHAM_STUDY documents`)

  // Reset THEMESSAGE_TRACT documents
  const tractResult = await prisma.document.updateMany({
    where: {
      source: "THEMESSAGE_TRACT"
    },
    data: {
      indexed: false
    }
  })
  console.log(`   ✅ Reset ${tractResult.count} THEMESSAGE_TRACT documents`)

  console.log("\n✅ All documents reset! You can now re-run the indexation scripts.")
  console.log("   Run these commands:")
  console.log("   npx tsx scripts/index-branham-studies.ts")
  console.log("   npx tsx scripts/index-branham-pages.ts")
  console.log("   npx tsx scripts/index-tracts.ts")
}

resetDocuments()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
