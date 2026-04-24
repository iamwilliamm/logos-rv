import Link from "next/link"
import { Search, FileText, ArrowRight } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link
        href="/search"
        className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 p-6 transition-all duration-300 shadow-sm"
      >
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-200/50 blur-3xl transition-all group-hover:bg-blue-300/50" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white p-3 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Nouvelle recherche IA</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Recherchez dans la Bible et les prédications
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-transform" />
        </div>
      </Link>

      <Link
        href="/sheets/new"
        className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-violet-50 hover:bg-violet-100 p-6 transition-all duration-300 shadow-sm"
      >
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-violet-200/50 blur-3xl transition-all group-hover:bg-violet-300/50" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white p-3 text-violet-600 group-hover:scale-110 transition-transform shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Créer une fiche</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Préparez votre prochaine prédication
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-violet-400 group-hover:translate-x-1 group-hover:text-violet-600 transition-transform" />
        </div>
      </Link>
    </div>
  )
}

