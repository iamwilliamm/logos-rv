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

    const searches = await prisma.search.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        query: true,
        mode: true,
        createdAt: true,
      },
    })

    return NextResponse.json(searches)
  } catch (error) {
    console.error("Error fetching recent searches:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des recherches" },
      { status: 500 }
    )
  }
}
