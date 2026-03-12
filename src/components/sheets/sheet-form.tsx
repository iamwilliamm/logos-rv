"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SheetFormProps {
  initialData?: {
    title: string
    theme?: string
    notes?: string
  }
  onSubmit: (data: { title: string; theme?: string; notes?: string }) => void
  isLoading?: boolean
}

export function SheetForm({ initialData, onSubmit, isLoading }: SheetFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [theme, setTheme] = useState(initialData?.theme || "")
  const [notes, setNotes] = useState(initialData?.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, theme, notes })
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
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          placeholder="Vos notes personnelles..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
          className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={isLoading || !title.trim()}>
        {isLoading ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
