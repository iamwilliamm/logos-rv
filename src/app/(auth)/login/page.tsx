import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { EagleLogo } from "@/components/ui/eagle-logo"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <EagleLogo size="lg" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bon retour</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Connectez-vous pour accéder à votre espace d&apos;étude
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <LoginForm />
        </div>

        <div className="text-center text-sm font-medium">
          <p className="text-slate-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Créer un compte
            </Link>
          </p>
          <p className="mt-4">
            <Link
              href="/reset-password"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

