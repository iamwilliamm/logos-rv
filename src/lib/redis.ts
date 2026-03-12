import { Redis } from "@upstash/redis"

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Upstash Redis credentials are not defined")
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Cache TTL in seconds
export const CACHE_TTL = {
  SEARCH_RESULTS: 60 * 60, // 1 hour
  EMBEDDINGS: 60 * 60 * 24 * 7, // 7 days
}
