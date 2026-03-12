"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadFormProps {
  onUploadSuccess: () => void
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [source, setSource] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !source) return

    setIsUploading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("source", source)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'upload")
        return
      }

      setSuccess(data.message)
      setFile(null)
      setTitle("")
      setSource("")
      onUploadSuccess()
    } catch (err) {
      setError("Erreur lors de l'upload")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Fichier (.txt, .docx, .pdf)</Label>
        <Input
          id="file"
          type="file"
          accept=".txt,.docx,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre du document</Label>
        <Input
          id="title"
          type="text"
          placeholder="Ex: Bible Darby - Genèse"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          type="text"
          placeholder="Ex: BIBLE_DARBY, BRANHAM, PASTOR"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          disabled={isUploading}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <Button type="submit" disabled={isUploading || !file || !title || !source}>
        {isUploading ? "Upload en cours..." : "Uploader"}
      </Button>
    </form>
  )
}
