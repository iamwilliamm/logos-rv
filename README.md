# Logos.rv

> Plateforme de recherche biblique par IA et création de fiches de prédication pour pasteurs et prédicateurs

## 🎯 Vision

Logos.rv permet aux serviteurs de Dieu de préparer leurs messages plus efficacement en combinant :

- Recherche sémantique dans les Écritures (Darby, Segond, Martin)
- Accès aux enseignements de William Marrion Branham
- Accès aux prédications de pasteurs locaux
- Organisation structurée des fiches de prédication

## ✨ Fonctionnalités MVP

- 🔍 **Recherche IA avancée** - Recherche par mots-clés ou questions en langage naturel
- 📝 **Fiches de prédication** - Création, édition et sauvegarde de vos préparations
- 📚 **Sources multiples** - 3 versions de la Bible + prédications Branham + pasteur local
- 💎 **Freemium** - Plan gratuit + premium pour fonctionnalités avancées
- 🔐 **Authentification** - Connexion sécurisée (email ou Google)

## 🛠️ Stack Technique

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** React + Tailwind CSS + Shadcn/ui
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Cache:** Upstash Redis
- **Vector DB:** Upstash Vector
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **AI:** OpenAI (embeddings + GPT-4)
- **Jobs:** Inngest
- **Hosting:** Vercel
- **Analytics:** PostHog

## 📦 Installation

```bash
# Clone le repo
git clone https://github.com/[username]/logos-rv.git
cd logos-rv

# Installe les dépendances
npm install

# Configure les variables d'environnement
cp .env.example .env.local
# Édite .env.local avec tes clés

# Setup la base de données
npx prisma generate
npx prisma migrate dev

# Lance le serveur de dev
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## 🗂️ Structure du Projet

```
logos-rv/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Pages authentification
│   │   ├── (dashboard)/  # Pages utilisateur
│   │   ├── (admin)/      # Interface admin
│   │   └── api/          # API routes
│   ├── components/       # Composants React
│   │   ├── ui/           # Shadcn components
│   │   ├── search/       # Recherche
│   │   ├── sheets/       # Fiches
│   │   └── layout/       # Layout
│   ├── lib/              # Utilitaires
│   │   ├── ai/           # Logique IA
│   │   ├── prisma.ts     # Client Prisma
│   │   ├── auth.ts       # Config NextAuth
│   │   └── stripe.ts     # Config Stripe
│   └── types/            # Types TypeScript
├── prisma/
│   └── schema.prisma     # Schéma DB
├── public/               # Assets statiques
├── PRD.md                # Product Requirements Document
└── CLAUDE.md             # Config Claude Code
```

## 🚀 Roadmap MVP (7 semaines)

- **Semaine 1:** Setup projet + Auth
- **Semaine 2-3:** Upload & indexation documents
- **Semaine 3-4:** Recherche IA
- **Semaine 4-5:** Fiches de prédication
- **Semaine 5:** Dashboard
- **Semaine 6:** Freemium + Stripe
- **Semaine 7:** Polish + Launch

Voir [PRD.md](./PRD.md) pour détails complets.

## 📊 Modèle Freemium

### Plan Gratuit

- 10 recherches/jour
- 5 fiches maximum
- Accès aux 3 Bibles
- Extraits prédications Branham

### Plan Premium (9.99€/mois)

- Recherches illimitées
- Fiches illimitées
- Accès complet Branham
- Prédications pasteur
- Export PDF
- Support prioritaire

## 🔐 Variables d'Environnement

Crée un fichier `.env.local` avec :

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ton-secret-genere"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Upstash Vector
UPSTASH_VECTOR_URL="..."
UPSTASH_VECTOR_TOKEN="..."

# Upstash Redis
UPSTASH_REDIS_URL="..."
UPSTASH_REDIS_TOKEN="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# PostHog
NEXT_PUBLIC_POSTHOG_KEY="..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

## 🧪 Commandes

```bash
# Développement
npm run dev

# Build production
npm run build
npm start

# Prisma
npx prisma studio          # Interface DB
npx prisma generate        # Génère client
npx prisma migrate dev     # Migrations dev
npx prisma migrate deploy  # Migrations prod

# Linting
npm run lint
npm run type-check
```

## 📝 Conventions de Code

- **TypeScript strict mode** activé
- **Server Components** par défaut
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants
- **Zod** pour validation
- **Commits conventionnels** (feat, fix, docs, etc.)

## 🤝 Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/amazing-feature`)
3. Commit tes changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvre une Pull Request

## 📄 License

MIT License - voir [LICENSE](./LICENSE)

## 📧 Contact

Pour questions ou support : [ton-email@example.com]

## 🙏 Remerciements

- William Marrion Branham pour ses enseignements
- La communauté open-source
- Tous les pasteurs qui utilisent Logos.rv

---

**Fait avec ❤️ pour les serviteurs de Dieu**
