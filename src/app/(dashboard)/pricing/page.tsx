"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Check, Zap, Crown, ArrowRight, Loader2 } from "lucide-react"
import { usePaystackPayment } from "react-paystack"

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const email = (session?.user?.email) || ""

  // Configuration Paystack Inline - recalculée à chaque render pour avoir l'email à jour
  const config = {
    reference: "logos_" + (new Date()).getTime().toString(),
    email: email,
    amount: 500000, // 5000 XOF (en kobo)
    currency: "XOF",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  }

  const initializePayment = usePaystackPayment(config)

  const handleSubscribe = (plan: "FREE" | "PREMIUM") => {
    if (!session) {
      router.push("/login")
      return
    }

    if (plan === "FREE") {
      router.push("/dashboard")
      return
    }

    // Vérifier que l'email est bien disponible
    if (!email || !email.includes("@")) {
      alert("Erreur : impossible de récupérer votre email. Veuillez vous reconnecter.")
      return
    }

    setIsLoading(true)

    const onSuccess = async (reference: any) => {
      try {
        await fetch("/api/paystack/callback?reference=" + reference.reference)
        router.push("/dashboard?payment=success")
        router.refresh()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    const onClose = () => {
      setIsLoading(false)
    }

    initializePayment({ onSuccess: onSuccess as any, onClose: onClose as any })
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Choisissez votre plan
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
          Préparez vos prédications avec l&apos;assistance de l&apos;IA
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Plan Gratuit */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 transition-all hover:border-slate-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Zap className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Gratuit</h3>
              <p className="text-xs font-medium text-slate-400">Pour découvrir</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">0 XOF</span>
            <span className="text-slate-400 text-sm ml-2">/mois</span>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "10 recherches par jour",
              "5 fiches maximum",
              "Accès aux 3 Bibles",
              "Extraits des prédications",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-slate-400" />
                </div>
                <span className="text-sm text-slate-600 font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe("FREE")}
            className="w-full h-12 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Plan actuel
          </button>
        </div>

        {/* Plan Premium */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-600 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-full uppercase tracking-wider">
              Recommandé
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Crown className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Premium</h3>
              <p className="text-xs font-bold text-blue-600">Pour les ministres</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">5 000 XOF</span>
            <span className="text-slate-400 text-sm ml-2">/mois</span>
            <p className="text-xs text-blue-600 mt-1 font-medium">~9.99 USD / mois</p>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Recherches IA illimitées",
              "Fiches illimitées",
              "Export PDF",
              "Accès complet aux sermons",
              "Support prioritaire",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm text-slate-700 font-bold">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe("PREMIUM")}
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Passer à Premium
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Moyens de paiement acceptés</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">Visa / Mastercard</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-[10px]">OM</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Orange Money</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-yellow-400 flex items-center justify-center shadow-sm">
              <span className="text-black font-black text-[10px]">MTN</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">MTN MoMo</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-sky-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-[9px]">MOOV</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Moov Money</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-14 rounded-lg bg-[#1DC3F0] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-[10px]">wave</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Wave</span>
          </div>
        </div>
      </div>
    </div>
  )
}
