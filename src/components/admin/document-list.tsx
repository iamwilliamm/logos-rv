interface Document {
  id: string
  title: string
  source: string
  fileType?: string | null
  fileSize?: number | null
  indexed: boolean
  createdAt: string
}

interface DocumentListProps {
  documents: Document[]
  onDelete: (id: string) => void
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "N/A"
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Documents indexés ({documents.length})
      </h3>
      {documents.length === 0 ? (
        <p className="text-muted-foreground">Aucun document uploadé</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4"
            >
              <div className="flex-1">
                <h4 className="font-medium">{doc.title}</h4>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{doc.source}</span>
                  <span>•</span>
                  <span>{doc.fileType?.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span>•</span>
                  <span className={doc.indexed ? "text-green-600" : "text-yellow-600"}>
                    {doc.indexed ? "✓ Indexé" : "⏳ En cours"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm("Supprimer ce document ?")) {
                    onDelete(doc.id)
                  }
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
