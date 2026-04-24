import { Index } from "@upstash/vector"

let vectorIndexInstance: Index | null = null

export function getVectorIndex() {
  if (vectorIndexInstance) return vectorIndexInstance

  const url = process.env.UPSTASH_VECTOR_REST_URL
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN

  if (!url || !token) {
    throw new Error("Upstash Vector credentials are not defined")
  }

  vectorIndexInstance = new Index({
    url,
    token,
  })

  return vectorIndexInstance
}

export const vectorIndex = {
  query: (params: any) => getVectorIndex().query(params),
  upsert: (params: any) => getVectorIndex().upsert(params),
  delete: (id: string) => getVectorIndex().delete(id),
}
