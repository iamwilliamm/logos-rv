const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const documents = await prisma.document.findMany({
    select: {
      id: true,
      title: true,
      source: true,
      indexed: true,
    },
    take: 10
  })

  console.log('Documents dans la base:')
  console.log(JSON.stringify(documents, null, 2))

  const count = await prisma.document.count()
  console.log(`\nTotal documents: ${count}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
