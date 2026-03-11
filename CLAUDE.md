# Logos.rv - Configuration Claude Code

## Vue d'ensemble du projet

Logos.rv est une plateforme SaaS permettant aux pasteurs et prédicateurs de faire des recherches bibliques approfondies via IA et de créer des fiches de prédication structurées.

**Public cible:** Pasteurs et prédicateurs francophones
**Modèle:** Freemium (gratuit limité + premium 9.99€/mois)

## Stack Technique

### Frontend
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- React 18+
- Tailwind CSS
- Shadcn/ui pour les composants
- React Hook Form + Zod pour les formulaires

### Backend
- Next.js API Routes (App Router)
- Prisma ORM
- PostgreSQL (Neon)
- Upstash Redis (cache)
- Upstash Vector ou Pinecone (recherche vectorielle)
- Inngest (background jobs)

### Services Externes
- NextAuth.js (authentification)
- Stripe (paiements)
- OpenAI API (embeddings + GPT-4) ou Anthropic Claude
- Vercel (déploiement)
- PostHog (analytics)

## Architecture

### Structure des dossiers
```
src/
├── app/
│   ├── (auth)/          # Pages authentification
│   ├── (dashboard)/     # Pages utilisateur connecté
│   ├── (admin)/         # Interface admin
│   └── api/             # API routes
├── components/
│   ├── ui/              # Shadcn components
│   ├── search/          # Composants recherche
│   ├── sheets/          # Composants fiches
│   └── layout/          # Layout components
├── lib/
│   ├── ai/              # Logique IA (embeddings, RAG)
│   ├── prisma.ts
│   ├── auth.ts
│   └── stripe.ts
└── types/               # Types TypeScript
```

### Base de données (Prisma)
- **User:** Utilisateurs (email, role, plan)
- **Sheet:** Fiches de prédication
- **Search:** Historique des recherches
- **Document:** Documents indexés (Bibles, prédications)

## Fonctionnalités MVP

### 1. Authentification
- Inscription/connexion (email + Google)
- Reset password
- Protection des routes

### 2. Recherche IA
- Mode recherche par mots-clés
- Mode Q&A (questions en langage naturel)
- Sources: Bibles (Darby, Segond, Martin) + prédications Branham + prédications pasteur
- Affichage des références exactes

### 3. Fiches de Prédication
- CRUD complet
- Structure: titre, thème, versets, plan, notes
- Sauvegarde automatique
- Ajout de versets depuis recherche

### 4. Dashboard
- Fiches récentes
- Recherches récentes
- Statistiques basiques

### 5. Admin
- Upload prédications (.txt, .docx, .pptx)
- Indexation automatique
- Gestion des documents

### 6. Freemium
- Plan gratuit: 10 recherches/jour, 5 fiches max
- Plan premium: illimité + export PDF
- Intégration Stripe

## Conventions de Code

### TypeScript
- Mode strict activé
- Pas de `any`, utiliser `unknown` si nécessaire
- Interfaces pour les types de données
- Zod pour validation runtime

### React/Next.js
- Server Components par défaut
- Client Components uniquement si nécessaire (interactivité)
- Utiliser `use server` pour les Server Actions
- Pas de `use client` inutile

### Styling
- Tailwind CSS uniquement
- Utiliser les composants Shadcn/ui
- Pas de CSS modules ou styled-components
- Classes utilitaires Tailwind

### Naming
- Fichiers: kebab-case (`user-profile.tsx`)
- Composants: PascalCase (`UserProfile`)
- Fonctions: camelCase (`getUserData`)
- Constantes: UPPER_SNAKE_CASE (`API_URL`)

### API Routes
- RESTful conventions
- Validation avec Zod
- Gestion d'erreurs cohérente
- Rate limiting (Upstash Redis)

## Sécurité

- Validation de toutes les entrées utilisateur
- Protection CSRF (NextAuth)
- Rate limiting sur les API
- Sanitization des données
- Pas de secrets dans le code (variables d'environnement)

## Performance

- Server Components pour réduire le JS client
- Images optimisées (next/image)
- Lazy loading des composants lourds
- Cache Redis pour requêtes fréquentes
- Pagination des listes

## Variables d'Environnement

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
OPENAI_API_KEY=
# ou
ANTHROPIC_API_KEY=

# Vector DB
UPSTASH_VECTOR_URL=
UPSTASH_VECTOR_TOKEN=

# Redis
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Workflow de Développement

1. Créer une branche feature (`git checkout -b feature/nom`)
2. Développer avec commits atomiques
3. Tester localement
4. Push et créer PR
5. Review + merge dans main
6. Déploiement automatique sur Vercel

## Tests

- Tests unitaires: Vitest
- Tests E2E: Playwright (post-MVP)
- Tests API: Supertest (post-MVP)

## Commandes Utiles

```bash
# Dev
npm run dev

# Build
npm run build

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma studio

# Lint
npm run lint
npm run type-check
```

## Priorités MVP

1. **P0 (Critique):** Auth, Recherche IA, Fiches
2. **P1 (Important):** Dashboard, Admin, Freemium
3. **P2 (Nice to have):** Export PDF, Partage

## Notes Importantes

- **Langue:** Interface en français uniquement pour MVP
- **Sources:** Prédications déjà disponibles en fichiers txt/docx/pptx
- **IA:** Privilégier OpenAI pour embeddings (text-embedding-3-large) et GPT-4 pour Q&A
- **Coûts:** Surveiller usage API IA, implémenter cache agressif

## Ressources

- PRD complet: `/PRD.md`
- Roadmap: Voir section 7 du PRD
- Schéma DB: Voir section 6.2 du PRD
