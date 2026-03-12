import { redis, CACHE_TTL } from "@/lib/redis"
import { searchVectors, SearchResult } from "./search"

export async function getCachedSearch(
  query: string,
  mode: string
): Promise<SearchResult[] | null> {
  try {
    const cacheKey = `search:${mode}:${query.toLowerCase()}`
    const cached = await redis.get(cacheKey)
    return cached as SearchResult[] | null
  } catch (error) {
    console.error("Error getting cached search:", error)
    return null
  }
}

export async function setCachedSearch(
  query: string,
  mode: string,
  results: SearchResult[]
): Promise<void> {
  try {
    const cacheKey = `search:${mode}:${query.toLowerCase()}`
    await redis.setex(cacheKey, CACHE_TTL.SEARCH_RESULTS, JSON.stringify(results))
  } catch (error) {
    console.error("Error setting cached search:", error)
  }
}

export async function searchWithCache(
  query: string,
  mode: string,
  topK: number = 10
): Promise<SearchResult[]> {
  // Try to get from cache first
  const cached = await getCachedSearch(query, mode)
  if (cached) {
    return cached
  }

  // If not in cache, search vectors
  const results = await searchVectors(query, topK)

  // Cache the results
  await setCachedSearch(query, mode, results)

  return results
}
