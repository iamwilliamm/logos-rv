const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '.env.local') })

const { Index } = require('@upstash/vector')

async function main() {
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  })

  // Check namespace info
  const info = await index.info()
  console.log('Vector DB info:', JSON.stringify(info, null, 2))

  // Try to fetch some vectors to see metadata structure
  const range = await index.range({ cursor: 0, limit: 5, includeMetadata: true })
  console.log('\nSample vectors:')
  range.vectors.forEach((v, i) => {
    console.log(`\n--- Vector ${i + 1} ---`)
    console.log('ID:', v.id)
    console.log('Metadata:', JSON.stringify(v.metadata, null, 2))
  })
}

main().catch(console.error)
