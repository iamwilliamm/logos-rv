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

    const sheets = await prisma.sheet.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        theme: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(sheets)
  } catch (error) {
    console.error("Error fetching recent sheets:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des fiches" },
      { status: 500 }
    )
  }
}
