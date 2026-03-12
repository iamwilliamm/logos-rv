import Link from "next/link"

interface Sheet {
  id: string
  title: string
  theme?: string | null
  tags?: string | null
  updatedAt: string
}

interface SheetCardProps {
  sheet: Sheet
  onDelete?: (id: string) => void
}

export function SheetCard({ sheet, onDelete }: SheetCardProps) {
  const tags = sheet.tags ? JSON.parse(sheet.tags) : []

  return (
    <div className="group relative rounded-lg border bg-card p-6 transition-all hover:shadow-md">
      <Link href={`/sheets/${sheet.id}`} className="block">
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
          {sheet.title}
        </h3>
        {sheet.theme && (
          <p className="mb-3 text-sm text-muted-foreground">{sheet.theme}</p>
        )}
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Modifié {new Date(sheet.updatedAt).toLocaleDateString("fr-FR")}
        </p>
      </Link>
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault()
            if (confirm("Êtes-vous sûr de vouloir supprimer cette fiche ?")) {
              onDelete(sheet.id)
            }
          }}
          className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <svg
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
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
      )}
    </div>
  )
}
