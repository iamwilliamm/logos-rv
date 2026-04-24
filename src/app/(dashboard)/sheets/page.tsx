"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SheetCard } from "@/components/sheets/sheet-card"
import { FileText, Plus, Search as SearchIcon } from "lucide-react"

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
    <div className="space-y-10 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Mes Fiches
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Gérez vos préparations de prédication
          </p>
        </div>
        <Link
          href="/sheets/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200"
        >
          <Plus className="h-4 w-4" />
          NOUVELLE FICHE
        </Link>
      </div>

      {/* Barre de recherche Premium */}
      <div className="relative group max-w-2xl">
        <form onSubmit={handleSearch} className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-sm">
          <div className="pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par titre ou thème..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-0 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 text-[15px] font-medium"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all mr-1"
          >
            Filtrer
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl border border-slate-100 bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : sheets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <FileText className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune fiche trouvée</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
            Commencez par créer votre première fiche de prédication pour l&apos;organiser ici.
          </p>
          <Link
            href="/sheets/new"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            CRÉER UNE FICHE
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
          {sheets.map((sheet) => (
            <SheetCard key={sheet.id} sheet={sheet} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
