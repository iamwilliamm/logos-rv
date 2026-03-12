import Link from "next/link"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Actions rapides</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-auto flex-col items-start gap-1 p-4">
          <Link href="/search">
            <span className="text-base font-semibold">Nouvelle recherche</span>
            <span className="text-xs font-normal opacity-90">
              Rechercher dans les Écritures
            </span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col items-start gap-1 p-4">
          <Link href="/sheets/new">
            <span className="text-base font-semibold">Nouvelle fiche</span>
            <span className="text-xs font-normal opacity-90">
              Créer une fiche de prédication
            </span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
