import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const userId = (session.user as any).id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, role: true },
    })

    const isPremium = user?.role === "ADMIN" || user?.plan === "PREMIUM"

    if (isPremium) {
      return new Response(
        JSON.stringify({
          plan: "PREMIUM",
          searches: { limit: -1, remaining: -1 },
          sheets: { limit: -1, current: 0 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    // FREE users: 10 searches/day
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const searchesToday = await prisma.search.count({
      where: { userId, createdAt: { gte: today } },
    })

    const sheetCount = await prisma.sheet.count({
      where: { userId },
    })

    return new Response(
      JSON.stringify({
        plan: "FREE",
        searches: { limit: 10, remaining: Math.max(0, 10 - searchesToday) },
        sheets: { limit: 5, current: sheetCount },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
