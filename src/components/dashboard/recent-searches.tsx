import { Search as SearchIcon, History } from "lucide-react"

interface Search {
  id: string
  query: string
  mode: string
  createdAt: string
}

interface RecentSearchesProps {
  searches: Search[]
}

export function RecentSearches({ searches }: RecentSearchesProps) {
  if (searches.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-600" />
          Recherches récentes
        </h2>
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-500 text-sm">
            Aucune recherche effectuée
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-900 flex items-center gap-2">
        <History className="h-5 w-5 text-indigo-600" />
        Recherches récentes
      </h2>
      <div className="space-y-3">
        {searches.map((search) => (
          <div
            key={search.id}
            className="group rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors border border-indigo-100">
                <SearchIcon className="h-4 w-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate group-hover:text-indigo-700 transition-colors">{search.query}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {search.mode === "SEARCH" ? "Recherche" : "IA Q&A"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {new Date(search.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


