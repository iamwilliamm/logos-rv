import { Redis } from "@upstash/redis"

let redisInstance: Redis | null = null

export function getRedis() {
  if (redisInstance) return redisInstance

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error("Upstash Redis credentials are not defined")
  }

  redisInstance = new Redis({
    url,
    token,
  })

  return redisInstance
}

export const redis = {
  get: (key: string) => getRedis().get(key),
  setex: (key: string, ttl: number, value: any) => getRedis().setex(key, ttl, value),
  del: (key: string) => getRedis().del(key),
}

// Cache TTL in seconds
export const CACHE_TTL = {
  SEARCH_RESULTS: 60 * 60, // 1 hour
  EMBEDDINGS: 60 * 60 * 24 * 7, // 7 days
}
