"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { ExportPdfButton } from "@/components/sheets/export-pdf-button"

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

  // Ref pour le debounce
  const debouncedSave = useRef(
    debounce(async (data: Partial<Sheet>, id: string) => {
      setIsSaving(true)
      try {
        const response = await fetch(`/api/sheets/${id}`, {
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
    }, 1000)
  ).current

  const saveSheet = useCallback((data: Partial<Sheet>) => {
    if (!sheet) return
    debouncedSave(data, params.id)
  }, [sheet, params.id, debouncedSave])

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
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">{sheet.title}</h1>
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
          <ExportPdfButton
            sheetId={sheet.id}
            title={sheet.title}
            contentId="sheet-content"
          />
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      <div id="sheet-content" className="space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
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
                className="bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                className="bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainVerses">Écritures principales</Label>
              <Input
                id="mainVerses"
                value={sheet.mainVerses || ""}
                onChange={(e) => {
                  setSheet({ ...sheet, mainVerses: e.target.value })
                  saveSheet({ mainVerses: e.target.value })
                }}
                placeholder="Jean 3:16, Romains 8:28, Psaume 23..."
                disabled={isSaving}
                className="bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 font-medium italic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes & Plan de prédication</Label>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <TiptapEditor
                  content={sheet.notes || ""}
                  onChange={(content) => {
                    setSheet({ ...sheet, notes: content })
                    saveSheet({ notes: content })
                  }}
                  placeholder="Commencez à rédiger votre prédication..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
