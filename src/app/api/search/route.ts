import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { searchWithCache } from "@/lib/ai/cache"
import { generateAnswer } from "@/lib/ai/qa"
import { searchSchema } from "@/lib/validations"

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

    // Validate input
    const { query, mode, sources } = searchSchema.parse(body)

    // Check rate limit for free users
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    })

    if (user?.plan === "FREE") {
      // Check searches today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const searchesToday = await prisma.search.count({
        where: {
          userId,
          createdAt: {
            gte: today,
          },
        },
      })

      if (searchesToday >= 10) {
        return NextResponse.json(
          { error: "Limite de 10 recherches par jour atteinte. Passez au plan Premium pour des recherches illimitées." },
          { status: 429 }
        )
      }
    }

    const startTime = Date.now()

    // Search vectors with cache
    const searchResults = await searchWithCache(query, mode, 10)

    let answer = null
    if (mode === "QA") {
      // Generate answer using Gemini
      answer = await generateAnswer(query, searchResults)
    }

    const latencyMs = Date.now() - startTime

    // Save search to database
    await prisma.search.create({
      data: {
        userId,
        query,
        mode,
        filters: sources ? JSON.stringify(sources) : null,
        results: JSON.stringify({
          searchResults,
          answer,
        }),
        latencyMs,
      },
    })

    return NextResponse.json({
      results: searchResults,
      answer,
      latencyMs,
    })
  } catch (error: any) {
    console.error("Search error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la recherche" },
      { status: 500 }
    )
  }
}
