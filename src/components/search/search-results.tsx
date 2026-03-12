interface SearchResult {
  id: string
  score: number
  metadata: {
    title: string
    source: string
    content: string
  }
}

interface SearchResultsProps {
  results: SearchResult[]
  answer?: string | null
  latencyMs?: number
}

export function SearchResults({ results, answer, latencyMs }: SearchResultsProps) {
  if (results.length === 0 && !answer) {
    return null
  }

  return (
    <div className="space-y-6">
      {latencyMs && (
        <p className="text-sm text-muted-foreground">
          Résultats en {(latencyMs / 1000).toFixed(2)}s
        </p>
      )}

      {answer && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold">Réponse</h3>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{answer}</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {answer ? "Sources" : "Résultats"} ({results.length})
          </h3>
          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{result.metadata.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.metadata.source}
                  </p>
                </div>
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {Math.round(result.score * 100)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {result.metadata.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
