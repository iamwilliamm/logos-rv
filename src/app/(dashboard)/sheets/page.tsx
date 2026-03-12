"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SheetCard } from "@/components/sheets/sheet-card"

interface Sheet {
  id: string
  title: string
  theme?: string | null
  tags?: string | null
  updatedAt: string
}

export default function SheetsPage() {
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchSheets()
  }, [])

  const fetchSheets = async (searchQuery?: string) => {
    try {
      const url = searchQuery
        ? `/api/sheets?search=${encodeURIComponent(searchQuery)}`
        : "/api/sheets"
      const response = await fetch(url)
      const data = await response.json()
      setSheets(data)
    } catch (error) {
      console.error("Error fetching sheets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSheets(search)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/sheets/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSheets(sheets.filter((sheet) => sheet.id !== id))
      }
    } catch (error) {
      console.error("Error deleting sheet:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Fiches</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches de prédication
          </p>
        </div>
        <Button asChild>
          <Link href="/sheets/new">Nouvelle fiche</Link>
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Rechercher une fiche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">Rechercher</Button>
      </form>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      ) : sheets.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-12 text-center">
          <p className="mb-4 text-muted-foreground">
            Vous n&apos;avez pas encore créé de fiche
          </p>
          <Button asChild>
            <Link href="/sheets/new">Créer ma première fiche</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <SheetCard key={sheet.id} sheet={sheet} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
