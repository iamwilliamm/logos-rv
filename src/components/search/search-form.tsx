"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchFormProps {
  onSearch: (query: string, mode: "SEARCH" | "QA") => void
  isLoading: boolean
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<"SEARCH" | "QA">("SEARCH")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query, mode)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="query">Votre recherche</Label>
        <Input
          id="query"
          type="text"
          placeholder="Ex: Que dit la Bible sur la foi ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label>Mode de recherche</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "SEARCH" ? "default" : "outline"}
            onClick={() => setMode("SEARCH")}
            disabled={isLoading}
            className="flex-1"
          >
            Recherche
          </Button>
          <Button
            type="button"
            variant={mode === "QA" ? "default" : "outline"}
            onClick={() => setMode("QA")}
            disabled={isLoading}
            className="flex-1"
          >
            Question & Réponse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {mode === "SEARCH"
            ? "Recherche par mots-clés dans les Écritures"
            : "Posez une question et obtenez une réponse contextualisée"}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !query.trim()}>
        {isLoading ? "Recherche en cours..." : "Rechercher"}
      </Button>
    </form>
  )
}
