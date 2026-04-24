import Link from "next/link"
import { convert } from "html-to-text"
import { Trash2, FileText, ChevronRight } from "lucide-react"

interface Sheet {
  id: string
  title: string
  theme?: string | null
  notes?: string | null
  tags?: string | null
  updatedAt: string
}

interface SheetCardProps {
  sheet: Sheet
  onDelete?: (id: string) => void
}

export function SheetCard({ sheet, onDelete }: SheetCardProps) {
  const tags = sheet.tags ? JSON.parse(sheet.tags) : []

  // Create a text preview from HTML
  const getPreview = (html?: string | null) => {
    if (!html) return ""
    const text = convert(html, {
      wordwrap: false,
      selectors: [
        { selector: 'a', options: { ignoreHref: true } },
        { selector: 'img', format: 'skip' }
      ]
    })
    return text.length > 100 ? text.substring(0, 100) + "..." : text
  }

  const preview = getPreview(sheet.notes)

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 hover:shadow-xl flex flex-col shadow-sm">
      <Link href={`/sheets/${sheet.id}`} className="block flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            {new Date(sheet.updatedAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {sheet.title}
        </h3>

        {sheet.theme && (
          <p className="mb-4 text-sm font-semibold text-indigo-600">{sheet.theme}</p>
        )}

        {preview && (
          <p className="mb-6 text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
            {preview}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 mt-auto">
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link href={`/sheets/${sheet.id}`} className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
          Ouvrir
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault()
              if (confirm("Êtes-vous sûr de vouloir supprimer cette fiche ? Cette action est irréversible.")) {
                onDelete(sheet.id)
              }
            }}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
