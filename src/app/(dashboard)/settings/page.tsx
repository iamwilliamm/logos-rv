"use client"

import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Settings as SettingsIcon, User as UserIcon, ShieldCheck, ArrowRight, Save, Crown, Zap } from "lucide-react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState(session?.user?.name || "")
  const [email] = useState(session?.user?.email || "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) throw new Error("Erreur lors de la mise à jour")

      await update()
      setMessage("Profil mis à jour avec succès")
    } catch (error) {
      setMessage("Une erreur est survenue")
    } finally {
      setIsSaving(false)
    }
  }

  const isPremium = (session?.user as any)?.plan === "PREMIUM"

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          Paramètres
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Gérez votre compte et vos préférences
        </p>
      </div>

      {/* Message de succès / erreur */}
      {message && (
        <div className={cn(
          "p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300",
          message.includes("succès")
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        )}>
          <p className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            {message.includes("succès") ? <ShieldCheck className="h-4 w-4" /> : null}
            {message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Profil */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] pointer-events-none group-focus-within:bg-blue-100/50 transition-colors" />

            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Profil Utilisateur
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nom complet</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="h-12 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-900 rounded-xl px-4 font-medium shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Adresse Email (Lecture seule)</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="h-12 bg-slate-100 border-slate-200 text-slate-400 rounded-xl px-4 font-medium cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <span className="animate-pulse">SAUVEGARDE...</span> : <><Save className="h-4 w-4" /> ENREGISTRER</>}
              </button>
            </div>
          </div>
        </div>

        {/* Colonne Abonnement */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Abonnement</h2>

            <div className="space-y-6 relative z-10">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Plan actuel</p>
                <div className="flex items-center gap-3">
                  {isPremium ? (
                    <>
                      <Crown className="h-6 w-6 text-amber-500" />
                      <span className="text-2xl font-black text-amber-600">PREMIUM</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-6 w-6 text-slate-400" />
                      <span className="text-2xl font-black text-slate-500">GRATUIT</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {isPremium
                  ? "Vous profitez de toutes les fonctionnalités de manière illimitée."
                  : "Version limitée. Passez à Premium pour débloquer toute la puissance."}
              </p>

              <button
                onClick={() => router.push("/settings/billing")}
                className="group flex items-center justify-between w-full px-6 py-4 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Gérer l&apos;abonnement
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
