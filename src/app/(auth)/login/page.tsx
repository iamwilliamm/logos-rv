import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous à votre compte Logos.rv
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Créer un compte
            </Link>
          </p>
          <p className="mt-2">
            <Link
              href="/reset-password"
              className="text-muted-foreground hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
