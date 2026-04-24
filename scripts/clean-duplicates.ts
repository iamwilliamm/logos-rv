import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDuplicates() {
  console.log('🧹 Nettoyage des doublons...\n')

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: 'asc' }
  })

  // Group by title + source
  const grouped = documents.reduce((acc, doc) => {
    const key = `${doc.title}|${doc.source}`
    if (!acc[key]) acc[key] = []
    acc[key].push(doc)
    return acc
  }, {} as Record<string, typeof documents>)

  let deleted = 0

  for (const [key, docs] of Object.entries(grouped)) {
    if (docs.length > 1) {
      const [title, source] = key.split('|')

      // Keep only the indexed one, or the oldest if none indexed
      const indexedDoc = docs.find(d => d.indexed)
      const toKeep = indexedDoc || docs[0]
      const toDelete = docs.filter(d => d.id !== toKeep.id)

      if (toDelete.length > 0) {
        console.log(`📄 ${title} (${source})`)
        console.log(`   ✅ Garder: ${toKeep.id} (${toKeep.indexed ? 'indexé' : 'plus ancien'})`)
        console.log(`   🗑️  Supprimer: ${toDelete.length} doublons`)

        for (const doc of toDelete) {
          await prisma.document.delete({ where: { id: doc.id } })
          deleted++
        }
        console.log('')
      }
    }
  }

  console.log(`\n✅ Nettoyage terminé: ${deleted} doublons supprimés`)

  // Show final count
  const remaining = await prisma.document.count()
  const indexed = await prisma.document.count({ where: { indexed: true } })

  console.log(`\n📊 État final:`)
  console.log(`   Total: ${remaining} documents`)
  console.log(`   Indexés: ${indexed}`)
  console.log(`   Non indexés: ${remaining - indexed}`)

  await prisma.$disconnect()
}

cleanDuplicates().catch(console.error)
