import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDocument } from "@/lib/parsers/document-parser"
import { indexDocument } from "@/lib/ai/indexation"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const source = formData.get("source") as string

    if (!file || !title || !source) {
      return NextResponse.json(
        { error: "Fichier, titre et source requis" },
        { status: 400 }
      )
    }

    // Get file extension
    const fileName = file.name
    const fileType = fileName.split(".").pop()?.toLowerCase()

    if (!fileType || !["txt", "docx", "pdf"].includes(fileType)) {
      return NextResponse.json(
        { error: "Type de fichier non supporté. Utilisez .txt, .docx ou .pdf" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse document
    const content = await parseDocument(buffer, fileType)

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le fichier est vide ou n'a pas pu être lu" },
        { status: 400 }
      )
    }

    // Create document in database
    const document = await prisma.document.create({
      data: {
        title,
        source,
        content,
        fileType,
        fileSize: buffer.length,
        indexed: false,
      },
    })

    // Index document in background
    indexDocument(document.id, title, source, content).catch((error) => {
      console.error("Background indexation error:", error)
    })

    return NextResponse.json(
      {
        message: "Document uploadé avec succès. Indexation en cours...",
        documentId: document.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'upload" },
      { status: 500 }
    )
  }
}
