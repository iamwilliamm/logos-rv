import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Logos.rv - Recherche Biblique par IA",
  description: "Plateforme de recherche biblique et création de fiches de prédication pour pasteurs et prédicateurs",
  keywords: ["Bible", "Prédication", "IA", "Recherche biblique", "Pasteur"],
  authors: [{ name: "Logos.rv" }],
  creator: "Logos.rv",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://logos.rv",
    title: "Logos.rv - Recherche Biblique par IA",
    description: "Plateforme de recherche biblique et création de fiches de prédication",
    siteName: "Logos.rv",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
