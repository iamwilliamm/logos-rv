"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UploadForm } from "@/components/admin/upload-form"
import { DocumentList } from "@/components/admin/document-list"

interface Document {
  id: string
  title: string
  source: string
  fileType?: string | null
  fileSize?: number | null
  indexed: boolean
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/documents")

      if (response.status === 403) {
        router.push("/dashboard")
        return
      }

      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/documents?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id))
      }
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">
          Gérez les documents et l&apos;indexation
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Upload de document</h2>
          <UploadForm onUploadSuccess={fetchDocuments} />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <DocumentList documents={documents} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}
