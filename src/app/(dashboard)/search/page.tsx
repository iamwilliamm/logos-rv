"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"

interface SearchResult {
  id: string
  score: number
  metadata: {
    title: string
    source: string
    content: string
  }
}

interface SearchResponse {
  results: SearchResult[]
  answer?: string | null
  latencyMs?: number
}

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchData, setSearchData] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string>("")

  const handleSearch = async (query: string, mode: "SEARCH" | "QA") => {
    setIsLoading(true)
    setError("")
    setSearchData(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue")
        return
      }

      setSearchData(data)
    } catch (err) {
      setError("Une erreur est survenue lors de la recherche")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recherche Biblique</h1>
        <p className="text-muted-foreground">
          Recherchez dans les Écritures avec l&apos;aide de l&apos;IA
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        <div className="lg:col-span-2">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          {searchData && (
            <SearchResults
              results={searchData.results}
              answer={searchData.answer}
              latencyMs={searchData.latencyMs}
            />
          )}

          {!searchData && !error && !isLoading && (
            <div className="rounded-lg border bg-muted/50 p-12 text-center">
              <p className="text-muted-foreground">
                Effectuez une recherche pour voir les résultats
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
