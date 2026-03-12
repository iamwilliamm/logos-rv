"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SheetForm } from "@/components/sheets/sheet-form"

export default function NewSheetPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (data: {
    title: string
    theme?: string
    notes?: string
  }) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Une erreur est survenue")
        return
      }

      router.push(`/sheets/${result.id}`)
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nouvelle Fiche</h1>
        <p className="text-muted-foreground">
          Créez une nouvelle fiche de prédication
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-card p-6">
        <SheetForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
