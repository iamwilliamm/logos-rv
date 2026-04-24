"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Crown, Zap, Check, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UserLimits {
  plan: string
  searches: { limit: number; remaining: number }
  sheets: { limit: number; current: number }
}

export default function BillingPage() {
  const { data: session } = useSession()
  const [limits, setLimits] = useState<UserLimits | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchLimits()
  }, [session])

  const fetchLimits = async () => {
    if (!session) return
    try {
      const response = await fetch("/api/user/limits")
      if (!response.ok) throw new Error("Erreur")
      const data = await response.json()
      setLimits(data)
    } catch (error) {
      console.error("Erreur lors du chargement des limites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setIsSubscribing(true)
    setMessage("")

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PREMIUM" }),
      })

      const data = await response.json()

      if (response.ok && data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url
      } else {
        setMessage(data.error || "Erreur lors de l'initialisation du paiement")
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion au service de paiement")
    } finally {
      setIsSubscribing(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  const isPremium = (session.user as any)?.plan === "PREMIUM"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Abonnement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre plan et votre abonnement
        </p>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-lg border",
          message.includes("Erreur")
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-green-50 border-green-200 text-green-700"
        )}>
          {message}
        </div>
      )}

      {/* Current Plan */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Plan actuel</h2>

        <div className="flex items-center gap-4">
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center",
            isPremium ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-gray-100"
          )}>
            {isPremium ? (
              <Crown className="h-8 w-8 text-white" />
            ) : (
              <Zap className="h-8 w-8 text-gray-500" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {isPremium ? "Premium" : "Gratuit"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? "Accès complet à toutes les fonctionnalités"
                : "10 recherches/jour, 5 fiches maximum"
              }
            </p>
          </div>

          {!isPremium && (
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubscribing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Crown className="h-4 w-4 mr-2" />
              )}
              Passer à Premium
            </Button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Utilisation</h2>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : limits ? (
          <div className="space-y-4">
            {/* Searches */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Recherches aujourd&apos;hui</span>
                <span>
                  {limits.searches.remaining === -1
                    ? "Illimité"
                    : `${limits.searches.remaining} restantes`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    limits.searches.remaining === -1
                      ? "bg-green-500 w-full"
                      : limits.searches.remaining <= 2
                      ? "bg-red-500 w-[20%]"
                      : limits.searches.remaining <= 5
                      ? "bg-yellow-500 w-[50%]"
                      : "bg-green-500 w-[80%]"
                  )}
                  style={{
                    width: limits.searches.remaining === -1
                      ? "100%"
                      : `${((limits.searches.limit - limits.searches.remaining) / limits.searches.limit) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Sheets */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Fiches créées</span>
                <span>
                  {limits.sheets.limit === -1
                    ? `Illimité (${limits.sheets.current} créées)`
                    : `${limits.sheets.current} / ${limits.sheets.limit}`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    limits.sheets.limit === -1
                      ? "bg-green-500 w-full"
                      : limits.sheets.current >= limits.sheets.limit
                      ? "bg-red-500 w-full"
                      : limits.sheets.current >= 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  )}
                  style={{
                    width: limits.sheets.limit === -1
                      ? "100%"
                      : `${(limits.sheets.current / limits.sheets.limit) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Erreur lors du chargement</p>
        )}
      </div>

      {/* Premium Features */}
      {!isPremium && (
        <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Débloquez toutes les fonctionnalités
          </h2>

          <ul className="space-y-3">
            {[
              "Recherches illimitées",
              "Fiches de prédication illimitées",
              "Export PDF des fiches",
              "Accès complet aux prédications",
              "Support prioritaire",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">5 000 XOF</p>
              <p className="text-sm text-muted-foreground">par mois</p>
            </div>
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubscribing ? "Chargement..." : "S'abonner maintenant"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Moyens de paiement acceptés</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Carte bancaire */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">Visa / Mastercard</span>
          </div>
          {/* Orange Money */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-[10px] leading-none tracking-tighter">OM</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Orange Money</span>
          </div>
          {/* MTN MoMo */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-yellow-400 flex items-center justify-center shadow-sm">
              <span className="text-black font-black text-[10px] leading-none tracking-tighter">MTN</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">MTN MoMo</span>
          </div>
          {/* Moov Money */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-sky-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-[9px] leading-none tracking-tighter">MOOV</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Moov Money</span>
          </div>
          {/* Wave */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-[#1DC3F0] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-[10px] leading-none tracking-tighter">wave</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Wave</span>
          </div>
        </div>
      </div>
    </div>
  )
}
