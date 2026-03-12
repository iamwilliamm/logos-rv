import Link from "next/link"
import { Button } from "@/components/ui/button"

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
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Fiches récentes</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Vous n&apos;avez pas encore créé de fiche
          </p>
          <Button asChild>
            <Link href="/sheets/new">Créer ma première fiche</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fiches récentes</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sheets">Voir tout</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {sheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/sheets/${sheet.id}`}
            className="block rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <h3 className="font-medium">{sheet.title}</h3>
            {sheet.theme && (
              <p className="text-sm text-muted-foreground">{sheet.theme}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Modifié {new Date(sheet.updatedAt).toLocaleDateString("fr-FR")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
