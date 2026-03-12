import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RecentSheets } from "@/components/dashboard/recent-sheets"
import { RecentSearches } from "@/components/dashboard/recent-searches"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"

async function getRecentSheets() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/sheets/recent`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

async function getRecentSearches() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/searches/recent`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

async function getStats() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/stats`, {
    cache: "no-store",
  })
  if (!res.ok) return { totalSheets: 0, searchesThisMonth: 0 }
  return res.json()
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const [sheets, searches, stats] = await Promise.all([
    getRecentSheets(),
    getRecentSearches(),
    getStats(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenue, {session.user?.name || "Pasteur"}
        </h1>
        <p className="text-muted-foreground">
          Préparez vos prédications avec l&apos;aide de l&apos;IA
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Fiches créées"
          value={stats.totalSheets}
          description="Total de vos fiches"
        />
        <StatsCard
          title="Recherches ce mois"
          value={stats.searchesThisMonth}
          description="Recherches effectuées"
        />
        <StatsCard
          title="Plan actuel"
          value="Gratuit"
          description="10 recherches par jour"
        />
      </div>

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSheets sheets={sheets} />
        <RecentSearches searches={searches} />
      </div>
    </div>
  )
}
