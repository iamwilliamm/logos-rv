import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sheetSchema } from "@/lib/validations"

// GET /api/sheets - List all user's sheets
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")

    const sheets = await prisma.sheet.findMany({
      where: {
        userId,
        ...(search && {
          OR: [
            { title: { contains: search } },
            { theme: { contains: search } },
          ],
        }),
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        theme: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(sheets)
  } catch (error) {
    console.error("Error fetching sheets:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des fiches" },
      { status: 500 }
    )
  }
}

// POST /api/sheets - Create new sheet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { title, theme, notes } = sheetSchema.parse(body)

    // Check limit for free users
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    })

    if (user?.plan === "FREE") {
      const sheetCount = await prisma.sheet.count({
        where: { userId },
      })

      if (sheetCount >= 5) {
        return NextResponse.json(
          { error: "Limite de 5 fiches atteinte. Passez au plan Premium pour des fiches illimitées." },
          { status: 429 }
        )
      }
    }

    const sheet = await prisma.sheet.create({
      data: {
        userId,
        title,
        theme,
        notes,
      },
    })

    return NextResponse.json(sheet, { status: 201 })
  } catch (error: any) {
    console.error("Error creating sheet:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la fiche" },
      { status: 500 }
    )
  }
}
