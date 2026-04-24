interface SearchResult {
  id: string
  score: number
  metadata: {
    title: string
    source: string
    content: string
    chunkIndex?: number
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

  const formatSourceName = (source: string) => {
    switch (source) {
      case "BIBLE_DARBY":
        return "Bible Darby"
      case "BIBLE_SEGOND":
        return "Louis Segond"
      case "BIBLE_MARTIN":
        return "Bible Martin"
      case "BRANHAM":
        return "Déclaration de William Marrion Branham"
      default:
        return source
    }
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
          {results.map((result) => {
            const isBranham = result.metadata.source === "BRANHAM"
            const paragraphNumber = result.metadata.chunkIndex !== undefined
              ? result.metadata.chunkIndex + 1
              : null

            return (
              <div
                key={result.id}
                className="rounded-lg border bg-card p-6 transition-colors hover:bg-muted"
              >
                <h4 className="mb-3 font-semibold text-foreground">
                  {formatSourceName(result.metadata.source)}
                </h4>
                <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-foreground">
                  {isBranham && paragraphNumber && (
                    <span className="font-semibold not-italic">{paragraphNumber}. </span>
                  )}
                  « {result.metadata.content} »
                </blockquote>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>— {result.metadata.title}</p>
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {Math.round(result.score * 100)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
