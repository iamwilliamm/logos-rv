import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, ChevronRight } from "lucide-react"

interface Sheet {
  id: string
  title: string
  theme?: string
  updatedAt: string
}

interface RecentSheetsProps {
  sheets: Sheet[]
}

export function RecentSheets({ sheets }: RecentSheetsProps) {
  if (sheets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Fiches récentes
        </h2>
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-500 mb-6 text-sm">
            Vous n&apos;avez pas encore créé de fiche
          </p>
          <Button asChild className="rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200">
            <Link href="/sheets/new">Créer ma première fiche</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Fiches récentes
        </h2>
        <Link href="/sheets" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">
          Voir tout
        </Link>
      </div>
      <div className="space-y-3">
        {sheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/sheets/${sheet.id}`}
            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50 hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{sheet.title}</h3>
              {sheet.theme && (
                <p className="text-xs text-slate-500 mt-1">{sheet.theme}</p>
              )}
              <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {new Date(sheet.updatedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}


