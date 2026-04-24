import { prisma } from "@/lib/prisma"

/**
 * Check if user has reached their daily search limit
 * FREE: 10 searches/day
 * PREMIUM: unlimited
 */
export async function checkSearchLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  limit: number
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  })

  // ADMIN and PREMIUM have unlimited searches
  if (user?.role === "ADMIN" || user?.plan === "PREMIUM") {
    return { allowed: true, remaining: -1, limit: -1 }
  }

  // FREE users: 10 searches per day
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const searchCount = await prisma.search.count({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  })

  const limit = 10
  const remaining = Math.max(0, limit - searchCount)
  const allowed = searchCount < limit

  return { allowed, remaining, limit }
}

/**
 * Check if user has reached their sheet limit
 * FREE: 5 sheets max
 * PREMIUM: unlimited
 */
export async function checkSheetLimit(userId: string): Promise<{
  allowed: boolean
  current: number
  limit: number
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  })

  // ADMIN and PREMIUM have unlimited sheets
  if (user?.role === "ADMIN" || user?.plan === "PREMIUM") {
    return { allowed: true, current: -1, limit: -1 }
  }

  // FREE users: 5 sheets max
  const sheetCount = await prisma.sheet.count({
    where: { userId },
  })

  const limit = 5
  const allowed = sheetCount < limit

  return { allowed, current: sheetCount, limit }
}

/**
 * Get user's current plan and limits
 */
export async function getUserLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  })

  const isPremium = user?.plan === "PREMIUM" || user?.role === "ADMIN"

  if (isPremium) {
    return {
      plan: "PREMIUM",
      searches: { limit: -1, remaining: -1 },
      sheets: { limit: -1, current: 0 },
    }
  }

  // Get FREE user limits
  const searchLimit = await checkSearchLimit(userId)
  const sheetLimit = await checkSheetLimit(userId)

  return {
    plan: "FREE",
    searches: {
      limit: searchLimit.limit,
      remaining: searchLimit.remaining,
    },
    sheets: {
      limit: sheetLimit.limit,
      current: sheetLimit.current,
    },
  }
}
