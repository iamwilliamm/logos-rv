"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Une erreur est survenue")
        return
      }

      router.push("/login?registered=true")
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nom Complet</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Pasteur Jean"
          {...register("name")}
          disabled={isLoading}
          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-900 rounded-xl px-4 font-medium transition-all shadow-inner"
        />
        {errors.name && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Adresse Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          {...register("email")}
          disabled={isLoading}
          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-900 rounded-xl px-4 font-medium transition-all shadow-inner"
        />
        {errors.email && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" title="Mot de passe" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={isLoading}
          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-900 rounded-xl px-4 font-medium transition-all shadow-inner"
        />
        {errors.password && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" title="Confirmer le mot de passe" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirmer mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          disabled={isLoading}
          className="h-12 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-900 rounded-xl px-4 font-medium transition-all shadow-inner"
        />
        {errors.confirmPassword && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 animate-in shake duration-300">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider text-center">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-[0.1em] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
      </button>
    </form>
  )
}
