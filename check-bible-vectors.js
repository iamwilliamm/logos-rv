const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '.env.local') })

const { Index } = require('@upstash/vector')

async function main() {
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  })

  // Iterate through all vectors looking for Bible sources
  let cursor = 0
  let bibleSources = new Set()
  let allSources = new Set()
  let bibleCount = 0
  let total = 0

  while (true) {
    const range = await index.range({ cursor, limit: 50, includeMetadata: true })

    for (const v of range.vectors) {
      total++
      const source = v.metadata?.source || 'UNKNOWN'
      allSources.add(source)

      if (source.includes('BIBLE')) {
        bibleCount++
        bibleSources.add(source)
        // Show first Bible vector found
        if (bibleCount <= 3) {
          console.log(`\n--- Bible Vector ${bibleCount} ---`)
          console.log('ID:', v.id)
          console.log('Source:', source)
          console.log('Title:', v.metadata?.title)
          console.log('Content (100 chars):', v.metadata?.content?.substring(0, 200))
        }
      }
    }

    if (!range.nextCursor || range.nextCursor === '0') break
    cursor = range.nextCursor
  }

  console.log('\n\n=== RÉSUMÉ ===')
  console.log('Total vecteurs:', total)
  console.log('Vecteurs bibliques:', bibleCount)
  console.log('\nToutes les sources:', [...allSources])
  console.log('Sources bibliques:', [...bibleSources])
}

main().catch(console.error)
