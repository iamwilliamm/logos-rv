"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UploadForm } from "@/components/admin/upload-form"
import { DocumentList } from "@/components/admin/document-list"
import { ShieldAlert, FileUp, Database, Loader2 } from "lucide-react"

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accès sécurisé...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-emerald-600" />
            Administration
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Gérez les documents et l&apos;indexation vectorielle du système
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
          <Database className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Base de données active</span>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        {/* Colonne Gauche - Upload */}
        <div className="xl:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] pointer-events-none" />

            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
              <FileUp className="h-5 w-5 text-emerald-600" />
              Nouveau document
            </h2>

            <div className="relative z-10">
              <UploadForm onUploadSuccess={fetchDocuments} />
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
              ⚠️ Attention
            </h3>
            <p className="text-sm text-amber-700 font-medium leading-relaxed">
              L&apos;indexation peut prendre quelques minutes selon la taille du document. Ne fermez pas la page pendant le traitement.
            </p>
          </div>
        </div>

        {/* Colonne Droite - Liste */}
        <div className="xl:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm h-full relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] pointer-events-none" />

             <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between relative z-10">
              <span>Bibliothèque système</span>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                {documents.length} fichiers
              </span>
            </h2>

            <div className="relative z-10">
              <DocumentList documents={documents} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
