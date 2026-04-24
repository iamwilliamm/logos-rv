import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/sheets/[id] - Get single sheet
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    const sheet = await prisma.sheet.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!sheet) {
      return NextResponse.json(
        { error: "Fiche non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(sheet)
  } catch (error) {
    console.error("Error fetching sheet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la fiche" },
      { status: 500 }
    )
  }
}

// PATCH /api/sheets/[id] - Update sheet
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const existingSheet = await prisma.sheet.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingSheet) {
      return NextResponse.json(
        { error: "Fiche non trouvée" },
        { status: 404 }
      )
    }

    // Update sheet
    const sheet = await prisma.sheet.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(sheet)
  } catch (error) {
    console.error("Error updating sheet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la fiche" },
      { status: 500 }
    )
  }
}

// DELETE /api/sheets/[id] - Delete sheet
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Verify ownership
    const existingSheet = await prisma.sheet.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingSheet) {
      return NextResponse.json(
        { error: "Fiche non trouvée" },
        { status: 404 }
      )
    }

    await prisma.sheet.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Fiche supprimée" })
  } catch (error) {
    console.error("Error deleting sheet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la fiche" },
      { status: 500 }
    )
  }
}
