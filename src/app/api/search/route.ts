import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { searchWithCache } from "@/lib/ai/cache"
import { generateGroqAnswerStream } from "@/lib/ai/groq"
import { searchSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const userId = (session.user as any).id
    const body = await req.json()

    // Validate input
    const { query, sources } = searchSchema.parse(body)
    const mode = "QA" // Unified mode

    // Check rate limit for free users (skip for ADMIN)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, role: true },
    })

    if (user?.plan === "FREE" && user?.role !== "ADMIN") {
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
        return new Response(
          JSON.stringify({ error: "Limite de 10 recherches par jour atteinte. Passez au plan Premium pour des recherches illimitées." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        )
      }
    }

    const startTime = Date.now()

    // Search vectors with cache
    const searchResults = await searchWithCache(query, mode, 10)

    // Prepare context for AI
    const contextData = searchResults.map((result) => ({
      title: result.metadata.title,
      source: result.metadata.source,
      content: result.metadata.content,
      chunkIndex: result.metadata.chunkIndex,
    }))

    // Generate streaming response with Groq
    const stream = await generateGroqAnswerStream(query, contextData)

    const latencyMs = Date.now() - startTime

    // Save search to database (async, don't wait)
    prisma.search.create({
      data: {
        userId,
        query,
        mode,
        filters: sources ? JSON.stringify(sources) : null,
        results: JSON.stringify({
          searchResults,
        }),
        latencyMs,
      },
    }).catch(err => console.error("Failed to save search:", err))

    // Create a transform stream to parse SSE and send as JSON chunks
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let sseBuffer = ""

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true })
        sseBuffer += text

        const lines = sseBuffer.split("\n")
        sseBuffer = lines.pop() || ""

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine) continue

          // Handle "data: " lines (normal SSE)
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6).trim()
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                controller.enqueue(encoder.encode(JSON.stringify({ content }) + "\n"))
              }
            } catch (e) {
              console.warn("API/search: Failed to parse SSE line data:", data)
            }
          } else if (trimmedLine.startsWith("{")) {
            // Sometimes we get raw JSON if the stream breaks or restarts
            try {
              const parsed = JSON.parse(trimmedLine)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                controller.enqueue(encoder.encode(JSON.stringify({ content }) + "\n"))
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
      },
      flush(controller) {
        if (sseBuffer.trim()) {
          const trimmedLine = sseBuffer.trim()
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6).trim()
            if (data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(JSON.stringify({ content }) + "\n"))
                }
              } catch (e) {
                // Ignore
              }
            }
          }
        }
      },
    })

    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Search error:", error)

    if (error.name === "ZodError") {
      return new Response(
        JSON.stringify({ error: "Données invalides" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ error: "Une erreur est survenue lors de la recherche" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
