export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          📖 Logos.rv
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Plateforme de recherche biblique par IA pour pasteurs et prédicateurs
        </p>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 text-3xl">🔍</div>
            <h3 className="mb-2 font-semibold text-gray-900">Recherche IA</h3>
            <p className="text-sm text-gray-600">
              Trouvez des passages bibliques pertinents en secondes
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 text-3xl">📝</div>
            <h3 className="mb-2 font-semibold text-gray-900">Fiches</h3>
            <p className="text-sm text-gray-600">
              Organisez vos préparations de prédication
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 text-3xl">📚</div>
            <h3 className="mb-2 font-semibold text-gray-900">Sources</h3>
            <p className="text-sm text-gray-600">
              Bibles + Branham + Prédications pasteur
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition">
            Commencer gratuitement
          </button>
          <button className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition">
            En savoir plus
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>🚀 MVP en développement - Lancement bientôt</p>
        </div>
      </div>
    </main>
  )
}
