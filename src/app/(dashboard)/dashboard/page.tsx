import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RecentSheets } from "@/components/dashboard/recent-sheets"
import { RecentSearches } from "@/components/dashboard/recent-searches"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { FileText, Search, Crown, Zap } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  // 1) Retrouver l'utilisateur exact
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect("/login")
  }

  const userId = user.id
  const isPremium = user.plan === "PREMIUM" || user.role === "ADMIN"

  // Fetch data directly from Prisma (plus fiable)
  const [sheets, searches, totalSheets, searchesThisMonth] = await Promise.all([
    prisma.sheet.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, theme: true, updatedAt: true },
    }),
    prisma.search.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, query: true, mode: true, createdAt: true },
    }),
    prisma.sheet.count({ where: { userId } }),
    prisma.search.count({
      where: {
        userId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ])

  const formattedSheets = sheets.map(s => ({ ...s, updatedAt: s.updatedAt.toISOString() }))
  const formattedSearches = searches.map(s => ({ ...s, createdAt: s.createdAt.toISOString() }))

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Bienvenue, {user.name || "Pasteur"}
          </h1>
          <p className="text-slate-500 text-lg">
            Préparez vos prédications avec l&apos;aide de l&apos;IA
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold text-slate-600">Système en ligne</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Fiches créées"
          value={totalSheets}
          description="Total de vos fiches"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatsCard
          title="Recherches ce mois"
          value={searchesThisMonth}
          description="Recherches effectuées"
          icon={<Search className="h-5 w-5" />}
        />
        <StatsCard
          title="Plan actuel"
          value={isPremium ? "Premium" : "Gratuit"}
          description={isPremium ? "Recherches et fiches illimitées" : "10 recherches par jour"}
          icon={isPremium ? <Crown className="h-5 w-5 text-amber-500" /> : <Zap className="h-5 w-5 text-slate-400" />}
          className={isPremium ? "bg-amber-50/50 border-amber-200" : ""}
        />
      </div>

      <QuickActions />

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSheets sheets={formattedSheets as any} />
        <RecentSearches searches={formattedSearches as any} />
      </div>
    </div>
  )
}
