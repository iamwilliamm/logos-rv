import { vectorIndex } from "@/lib/vector"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function cleanVectorDB() {
  console.log('🧹 Nettoyage de la base vectorielle...\n')

  // Get all valid document IDs from database
  const validDocs = await prisma.document.findMany({
    where: { indexed: true },
    select: { vectorId: true, title: true, source: true }
  })

  console.log(`✅ Documents valides dans la DB: ${validDocs.length}`)
  validDocs.forEach(doc => {
    console.log(`   - ${doc.title} (${doc.source}) - vectorId: ${doc.vectorId}`)
  })
  console.log('')

  // Get all vectors from Upstash
  console.log('🔍 Récupération de tous les vecteurs dans Upstash...')

  // Upstash Vector doesn't have a "list all" method, so we need to delete by namespace or reset
  // For now, let's delete vectors that are not in our valid list

  const validVectorIds = validDocs
    .map(doc => doc.vectorId)
    .filter(id => id !== null) as string[]

  console.log(`\n📋 VectorIds valides: ${validVectorIds.length}`)
  console.log(validVectorIds)

  // Note: Upstash Vector doesn't provide a way to list all vectors
  // We can only delete by ID if we know them
  // The best approach is to keep track of vectorIds in the database

  console.log('\n⚠️  Pour nettoyer complètement Upstash Vector:')
  console.log('   1. Aller sur https://console.upstash.com/')
  console.log('   2. Sélectionner votre index Vector')
  console.log('   3. Utiliser "Reset Index" pour tout supprimer')
  console.log('   4. Relancer l\'indexation des documents Branham')

  await prisma.$disconnect()
}

cleanVectorDB().catch(console.error)
