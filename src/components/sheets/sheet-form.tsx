"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TiptapEditor } from "@/components/editor/tiptap-editor"

interface SheetFormProps {
  initialData?: {
    title: string
    theme?: string
    mainVerses?: string
    notes?: string
  }
  onSubmit: (data: { title: string; theme?: string; mainVerses?: string; notes?: string }) => void
  isLoading?: boolean
}

export function SheetForm({ initialData, onSubmit, isLoading }: SheetFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [theme, setTheme] = useState(initialData?.theme || "")
  const [mainVerses, setMainVerses] = useState(initialData?.mainVerses || "")
  const [notes, setNotes] = useState(initialData?.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, theme, mainVerses, notes })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de la fiche *</Label>
        <Input
          id="title"
          type="text"
          placeholder="Ex: La foi qui déplace les montagnes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Thème</Label>
        <Input
          id="theme"
          type="text"
          placeholder="Ex: La foi, La prière, L'amour"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mainVerses">Écritures principales</Label>
        <Input
          id="mainVerses"
          type="text"
          placeholder="Ex: Jean 3:16, Romains 8:28, Psaume 23"
          value={mainVerses}
          onChange={(e) => setMainVerses(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes & Plan de prédication</Label>
        <TiptapEditor
          content={notes}
          onChange={setNotes}
          placeholder="Vos notes personnelles..."
        />
      </div>

      <Button type="submit" disabled={isLoading || !title.trim()}>
        {isLoading ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
