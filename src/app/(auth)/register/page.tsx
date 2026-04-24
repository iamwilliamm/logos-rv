import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { EagleLogo } from "@/components/ui/eagle-logo"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[500px] bg-violet-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <EagleLogo size="lg" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rejoignez-nous</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Créez votre compte Logos.rv en quelques secondes
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <RegisterForm />
        </div>

        <div className="text-center text-sm font-medium">
          <p className="text-slate-500">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

