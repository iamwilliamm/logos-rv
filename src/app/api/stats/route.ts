import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Get total sheets count
    const totalSheets = await prisma.sheet.count({
      where: { userId },
    })

    // Get searches count for this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const searchesThisMonth = await prisma.search.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    return NextResponse.json({
      totalSheets,
      searchesThisMonth,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    )
  }
}
