"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* ===== NAVBAR ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/50" : ""
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Logos</span>
            <span className="text-zinc-400">.rv</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Comment ça marche
            </a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Tarifs
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-4 py-2">
              Se connecter
            </Link>
            <Link
              href="/register"
              className="text-sm bg-zinc-100 text-zinc-900 px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-zinc-400 font-medium">MVP disponible — Essayez gratuitement</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            La recherche biblique
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              propulsée par l&apos;IA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Préparez des prédications puissantes en quelques minutes. Recherchez dans 3 versions de la Bible et les enseignements de William Branham avec une intelligence artificielle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-100 text-zinc-900 rounded-full font-semibold text-sm hover:bg-zinc-200 transition-all hover:-translate-y-0.5 shadow-lg shadow-zinc-100/10"
            >
              Commencer gratuitement
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-zinc-800 text-zinc-300 rounded-full font-semibold text-sm hover:bg-zinc-900 hover:border-zinc-700 transition-all"
            >
              Découvrir
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Sources indexées</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {["Bible Louis Segond", "Bible Darby", "Bible Martin", "W.M. Branham", "Études Bibliques"].map((source) => (
                <div
                  key={source}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium"
                >
                  {source}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES (Bento Grid) ===== */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Un outil complet pour préparer, rechercher et organiser vos prédications.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche IA intelligente</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xl">
                Posez vos questions en langage naturel et obtenez des réponses basées sur les Saintes Écritures et les enseignements de référence. Fini les heures de recherche manuelle.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3 Versions de la Bible</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Louis Segond, Darby et Martin. Comparez et croisez les versions en un clic.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fiches de prédication</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Créez, organisez et sauvegardez vos fiches avec un éditeur de texte riche.
              </p>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Prédications de William Branham</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xl">
                Accédez instantanément au corpus complet des sermons de William Marrion Branham, ainsi qu&apos;aux études bibliques de branham.org. Trouvez des enseignements connexes en quelques secondes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Export PDF</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Exportez vos fiches en PDF pour les imprimer et les partager.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3">Comment ça marche</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Simple comme 1, 2, 3
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Inscrivez-vous",
                desc: "Créez votre compte gratuitement en quelques secondes. Aucune carte bancaire requise.",
                color: "blue",
              },
              {
                step: "02",
                title: "Recherchez",
                desc: "Posez vos questions ou recherchez par mots-clés. L'IA trouve les passages pertinents pour vous.",
                color: "violet",
              },
              {
                step: "03",
                title: "Préparez",
                desc: "Créez vos fiches de prédication structurées avec les versets et enseignements trouvés.",
                color: "emerald",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className={`text-6xl font-black text-zinc-800 mb-4`}>{step}</div>
                <h3 className="text-xl font-semibold mb-2 -mt-6">{title}</h3>
                <p className="text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Tarifs</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Un plan pour chaque besoin
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Commencez gratuitement, passez à Premium quand vous êtes prêt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
              <h3 className="text-lg font-semibold mb-1">Gratuit</h3>
              <p className="text-sm text-zinc-500 mb-6">Pour découvrir Logos.rv</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">0 XOF</span>
                <span className="text-zinc-500 text-sm ml-2">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "10 recherches par jour",
                  "5 fiches de prédication",
                  "3 versions de la Bible",
                  "Prédications de Branham",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 text-center text-sm font-semibold border border-zinc-700 rounded-full hover:bg-zinc-800 transition-colors text-zinc-300"
              >
                Commencer
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 text-xs font-semibold bg-zinc-100 text-zinc-900 rounded-full">
                  Recommandé
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Premium</h3>
              <p className="text-sm text-zinc-500 mb-6">Pour les ministres engagés</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">5 000 XOF</span>
                <span className="text-zinc-500 text-sm ml-2">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Recherches illimitées",
                  "Fiches illimitées",
                  "Export PDF",
                  "Accès complet aux sermons",
                  "Support prioritaire",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-100">
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 text-center text-sm font-semibold bg-zinc-100 text-zinc-900 rounded-full hover:bg-zinc-200 transition-colors"
              >
                Passer à Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Prêt à transformer votre
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              préparation de prédication ?
            </span>
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
            Rejoignez Logos.rv et gagnez des heures de préparation chaque semaine.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-all hover:-translate-y-0.5 shadow-lg shadow-zinc-100/10"
          >
            Commencer gratuitement
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Logos</span>
              <span className="text-zinc-500">.rv</span>
            </Link>
            <span className="text-xs text-zinc-600">© 2026</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Conditions</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
