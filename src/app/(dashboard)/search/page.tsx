"use client"

import { SearchChat } from "@/components/search/search-chat"

export default function SearchPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Recherche Biblique</h1>
        <p className="text-muted-foreground">
          Recherchez dans les Écritures avec l&apos;aide de l&apos;IA
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <SearchChat />
      </div>
    </div>
  )
}
