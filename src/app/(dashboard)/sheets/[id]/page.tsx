"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Sheet {
  id: string
  title: string
  theme?: string | null
  mainVerses?: string | null
  outline?: string | null
  notes?: string | null
  searchResults?: string | null
  tags?: string | null
}

export default function SheetEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSheet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const fetchSheet = async () => {
    try {
      const response = await fetch(`/api/sheets/${params.id}`)
      if (!response.ok) {
        setError("Fiche non trouvée")
        return
      }
      const data = await response.json()
      setSheet(data)
    } catch (err) {
      setError("Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const saveSheet = useCallback(async (data: Partial<Sheet>) => {
    if (!sheet) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/sheets/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setLastSaved(new Date())
      }
    } catch (err) {
      console.error("Error saving:", err)
    } finally {
      setIsSaving(false)
    }
  }, [sheet, params.id])

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette fiche ?")) {
      return
    }

    try {
      const response = await fetch(`/api/sheets/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/sheets")
      }
    } catch (err) {
      setError("Erreur lors de la suppression")
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (error || !sheet) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Fiche non trouvée"}</p>
        <Button onClick={() => router.push("/sheets")} className="mt-4">
          Retour aux fiches
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{sheet.title}</h1>
          {lastSaved && (
            <p className="text-sm text-muted-foreground">
              Dernière sauvegarde: {lastSaved.toLocaleTimeString("fr-FR")}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/sheets")}>
            Retour
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={sheet.title}
                onChange={(e) => {
                  setSheet({ ...sheet, title: e.target.value })
                  saveSheet({ title: e.target.value })
                }}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Thème</Label>
              <Input
                id="theme"
                value={sheet.theme || ""}
                onChange={(e) => {
                  setSheet({ ...sheet, theme: e.target.value })
                  saveSheet({ theme: e.target.value })
                }}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={sheet.notes || ""}
                onChange={(e) => {
                  setSheet({ ...sheet, notes: e.target.value })
                  saveSheet({ notes: e.target.value })
                }}
                disabled={isSaving}
                className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
