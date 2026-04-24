"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, Search, FileText, Settings, Crown, Zap, ShieldAlert, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { EagleLogo } from "@/components/ui/eagle-logo"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recherche", href: "/search", icon: Search },
  { name: "Mes Fiches", href: "/sheets", icon: FileText },
]

const settingsNav = [
  { name: "Paramètres", href: "/settings", icon: Settings },
  { name: "Abonnement", href: "/settings/billing", icon: Crown },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session?.user) return
      try {
        const response = await fetch("/api/admin/documents")
        setIsAdmin(response.status !== 403)
      } catch {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [session])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex overflow-hidden">
      {/* Sidebar - Retour au design classique */}
      <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0 z-50 shadow-sm relative">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-100 px-6">
            <Link href="/dashboard" className="group">
              <EagleLogo size="sm" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.05)]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                  {item.name}
                </Link>
              )
            })}

            <div className="pt-8 pb-3 px-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Configuration
              </p>
            </div>

            {settingsNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-violet-50 text-violet-600 border border-violet-100 shadow-[0_0_10px_rgba(139,92,246,0.05)]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-violet-600" : "text-gray-400 group-hover:text-gray-600")} />
                  {item.name}
                </Link>
              )
            })}

            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 group",
                    pathname === "/admin"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <ShieldAlert className={cn("h-4 w-4 transition-transform group-hover:scale-110", pathname === "/admin" ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600")} />
                  Admin
                </Link>
              </div>
            )}
          </nav>

          {/* User Profile / Logout */}
          <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/80">
            <div className="flex items-center gap-3 px-2 py-2 mb-4 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900">
                  {session?.user?.name || session?.user?.email?.split('@')[0]}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {(session?.user as any)?.plan === "PREMIUM" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-yellow-700 uppercase tracking-wider">
                      <Crown className="h-2 w-2" />
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                      <Zap className="h-2 w-2" />
                      Gratuit
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50/50 relative">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto p-6 md:p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
