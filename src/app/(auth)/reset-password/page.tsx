import Link from "next/link"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Réinitialiser le mot de passe</h1>
          <p className="mt-2 text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <ResetPasswordForm />

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="text-muted-foreground hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
