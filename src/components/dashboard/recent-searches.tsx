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
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Recherches récentes</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Aucune recherche effectuée
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Recherches récentes</h2>
      <div className="space-y-3">
        {searches.map((search) => (
          <div
            key={search.id}
            className="rounded-lg border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{search.query}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {search.mode === "SEARCH" ? "Recherche" : "Q&A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
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
