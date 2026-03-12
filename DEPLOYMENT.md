# Guide de Déploiement - Logos.rv

## Vue d'ensemble

Ce document décrit la stratégie de déploiement pour Logos.rv, de l'environnement local à la production.

## Environnements

### 1. Local (Development)

- **URL:** http://localhost:3000
- **Base de données:** PostgreSQL local ou Neon (dev branch)
- **Variables:** `.env.local`
- **Usage:** Développement quotidien

### 2. Staging (Preview)

- **URL:** https://logos-rv-staging.vercel.app
- **Base de données:** Neon (staging branch)
- **Variables:** Vercel Environment Variables (Preview)
- **Usage:** Tests avant production, review PRs

### 3. Production

- **URL:** https://logos.rv (ou votre domaine)
- **Base de données:** Neon (production branch)
- **Variables:** Vercel Environment Variables (Production)
- **Usage:** Utilisateurs finaux

---

## Setup Initial

### 1. Créer le Projet Next.js

```bash
# Créer le projet
npx create-next-app@latest logos-rv --typescript --tailwind --app --src-dir

cd logos-rv

# Installer les dépendances principales
npm install @prisma/client prisma
npm install next-auth
npm install @upstash/redis @upstash/vector
npm install openai
npm install stripe
npm install inngest
npm install zod react-hook-form @hookform/resolvers
npm install posthog-js posthog-node

# Installer Shadcn/ui
npx shadcn-ui@latest init

# Installer les composants Shadcn de base
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
```

### 2. Configurer Prisma

```bash
# Initialiser Prisma
npx prisma init

# Copier le schéma depuis prisma-schema.prisma
# Puis générer le client
npx prisma generate

# Créer la première migration
npx prisma migrate dev --name init
```

### 3. Configurer les Variables d'Environnement

```bash
# Copier le fichier exemple
cp .env.example .env.local

# Éditer .env.local avec vos vraies clés
```

---

## Services Externes à Configurer

### 1. Neon (PostgreSQL)

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un projet "logos-rv"
3. Créer 3 branches:
   - `main` (production)
   - `staging`
   - `dev`
4. Copier les `DATABASE_URL` dans les environnements respectifs

### 2. Upstash (Redis + Vector)

**Redis:**

1. Créer un compte sur [upstash.com](https://upstash.com)
2. Créer une base Redis "logos-rv-cache"
3. Copier `UPSTASH_REDIS_URL` et `UPSTASH_REDIS_TOKEN`

**Vector:**

1. Créer une base Vector "logos-rv-embeddings"
2. Dimensions: 1536 (pour text-embedding-3-large)
3. Copier `UPSTASH_VECTOR_URL` et `UPSTASH_VECTOR_TOKEN`

### 3. OpenAI

1. Créer un compte sur [platform.openai.com](https://platform.openai.com)
2. Créer une API key
3. Ajouter des crédits (minimum $10)
4. Copier `OPENAI_API_KEY`

### 4. Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un projet "Logos.rv"
3. Activer "Google+ API"
4. Créer des identifiants OAuth 2.0
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://logos-rv-staging.vercel.app/api/auth/callback/google` (staging)
   - `https://logos.rv/api/auth/callback/google` (prod)
6. Copier `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`

### 5. Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Mode Test d'abord
3. Créer un produit "Logos.rv Premium"
4. Créer un prix: 9.99€/mois récurrent
5. Copier le Price ID dans `STRIPE_PREMIUM_PRICE_ID`
6. Copier les clés:
   - `STRIPE_SECRET_KEY` (sk*test*...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk*test*...)
7. Configurer un webhook:
   - URL: `https://votre-domaine.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copier `STRIPE_WEBHOOK_SECRET`

### 6. Inngest

1. Créer un compte sur [inngest.com](https://inngest.com)
2. Créer une app "logos-rv"
3. Copier `INNGEST_EVENT_KEY` et `INNGEST_SIGNING_KEY`
4. Configurer l'endpoint:
   - Dev: `http://localhost:3000/api/inngest`
   - Prod: `https://logos.rv/api/inngest`

### 7. PostHog

1. Créer un compte sur [posthog.com](https://posthog.com)
2. Créer un projet "Logos.rv"
3. Copier `NEXT_PUBLIC_POSTHOG_KEY`
4. Host: `https://app.posthog.com`

### 8. Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Connecter votre repo GitHub
3. Importer le projet
4. Configurer les variables d'environnement (voir section suivante)

---

## Configuration Vercel

### Variables d'Environnement

**Pour tous les environnements (Production, Preview, Development):**

```bash
# Database
DATABASE_URL=<voir Neon>

# NextAuth
NEXTAUTH_URL=<URL de l'environnement>
NEXTAUTH_SECRET=<générer avec: openssl rand -base64 32>

# Google OAuth
GOOGLE_CLIENT_ID=<voir Google Cloud>
GOOGLE_CLIENT_SECRET=<voir Google Cloud>

# OpenAI
OPENAI_API_KEY=<voir OpenAI>

# Upstash
UPSTASH_VECTOR_URL=<voir Upstash>
UPSTASH_VECTOR_TOKEN=<voir Upstash>
UPSTASH_REDIS_URL=<voir Upstash>
UPSTASH_REDIS_TOKEN=<voir Upstash>

# Stripe
STRIPE_SECRET_KEY=<sk_test pour staging, sk_live pour prod>
STRIPE_WEBHOOK_SECRET=<voir Stripe>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<pk_test pour staging, pk_live pour prod>
STRIPE_PREMIUM_PRICE_ID=<voir Stripe>

# Inngest
INNGEST_EVENT_KEY=<voir Inngest>
INNGEST_SIGNING_KEY=<voir Inngest>

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=<voir PostHog>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App Config
NEXT_PUBLIC_APP_URL=<URL de l'environnement>
NEXT_PUBLIC_APP_NAME=Logos.rv
ADMIN_EMAILS=<votre email admin>
```

### Build Settings

```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install

# Development Command
npm run dev
```

### Domaine Personnalisé

1. Acheter un domaine sur [Porkbun](https://porkbun.com) (ex: logos.rv)
2. Dans Vercel > Settings > Domains
3. Ajouter le domaine
4. Configurer les DNS selon les instructions Vercel

---

## Workflow de Déploiement

### 1. Développement Local

```bash
# Créer une branche feature
git checkout -b feature/nom-feature

# Développer
npm run dev

# Tester
npm run lint
npm run type-check

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/nom-feature
```

### 2. Pull Request & Preview

1. Créer une PR sur GitHub
2. Vercel déploie automatiquement un preview
3. URL preview: `https://logos-rv-git-feature-nom-username.vercel.app`
4. Tester sur le preview
5. Review du code
6. Merge dans `main`

### 3. Déploiement Production

```bash
# Après merge dans main
# Vercel déploie automatiquement en production

# Vérifier le déploiement
# Vercel > Deployments > Production

# Tester en production
# Vérifier les logs
# Vérifier PostHog analytics
```

---

## Migrations de Base de Données

### En Développement

```bash
# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations
npx prisma migrate dev

# Reset la DB (attention: perte de données)
npx prisma migrate reset
```

### En Production

```bash
# Déployer les migrations
npx prisma migrate deploy

# Ou via Vercel Build Command:
# "prisma migrate deploy && next build"
```

**Important:** Toujours tester les migrations en staging avant production !

---

## Indexation Initiale des Données

### 1. Indexer les Bibles

```bash
# Préparer les fichiers JSON
# data/bibles/darby.json
# data/bibles/segond.json
# data/bibles/martin.json

# Lancer le script d'indexation
npm run index:bibles
```

### 2. Uploader les Prédications

1. Se connecter en tant qu'admin
2. Aller sur `/admin/upload`
3. Uploader les fichiers (.txt, .docx)
4. Sélectionner la source (Branham ou Pasteur)
5. L'indexation se fait automatiquement via Inngest

---

## Monitoring & Logs

### 1. Vercel Logs

- Vercel Dashboard > Logs
- Filtrer par fonction, status, date
- Temps réel pendant le développement

### 2. PostHog Analytics

- Dashboard PostHog
- Événements trackés:
  - `search_performed`
  - `sheet_created`
  - `user_signup`
  - `subscription_created`

### 3. Stripe Dashboard

- Paiements
- Abonnements actifs
- Webhooks (vérifier les erreurs)

### 4. Upstash Monitoring

- Redis: hits/misses, latence
- Vector: nombre de requêtes, latence

---

## Rollback en Cas de Problème

### Option 1: Rollback Vercel

1. Vercel Dashboard > Deployments
2. Trouver le dernier déploiement stable
3. Cliquer sur "..." > "Promote to Production"

### Option 2: Revert Git

```bash
# Identifier le commit problématique
git log

# Revert le commit
git revert <commit-hash>

# Push
git push origin main

# Vercel redéploie automatiquement
```

---

## Checklist Avant Lancement Production

### Sécurité

- [ ] Toutes les variables d'environnement configurées
- [ ] `NEXTAUTH_SECRET` généré de manière sécurisée
- [ ] Clés API en mode production (Stripe, etc.)
- [ ] Rate limiting activé
- [ ] CORS configuré correctement

### Base de Données

- [ ] Migrations appliquées
- [ ] Bibles indexées
- [ ] Prédications uploadées et indexées
- [ ] Backup automatique configuré (Neon)

### Paiements

- [ ] Stripe en mode Live
- [ ] Webhooks configurés et testés
- [ ] Prix correct (9.99€/mois)
- [ ] Emails de confirmation fonctionnels

### Performance

- [ ] Cache Redis configuré
- [ ] Images optimisées
- [ ] Lighthouse score > 90

### Monitoring

- [ ] PostHog configuré
- [ ] Vercel Analytics activé
- [ ] Alertes configurées (Vercel, Stripe)

### Légal

- [ ] Mentions légales
- [ ] Politique de confidentialité (RGPD)
- [ ] CGU/CGV
- [ ] Cookies banner

### Tests

- [ ] Tests E2E passés
- [ ] Tests de charge (recherche IA)
- [ ] Tests sur mobile
- [ ] Tests sur différents navigateurs

---

## Coûts Mensuels Estimés

| Service        | Plan          | Coût                   |
| -------------- | ------------- | ---------------------- |
| Vercel         | Pro           | $20/mois               |
| Neon           | Launch        | $19/mois               |
| Upstash Redis  | Pay as you go | ~$5/mois               |
| Upstash Vector | Pay as you go | ~$10/mois              |
| OpenAI API     | Pay as you go | ~$50/mois (1000 users) |
| Stripe         | 1.4% + 0.25€  | Variable               |
| Inngest        | Free tier     | $0                     |
| PostHog        | Free tier     | $0                     |
| Domaine        | Porkbun       | ~$10/an                |

**Total estimé:** ~$100-120/mois pour 1000 utilisateurs actifs

---

## Support & Maintenance

### Tâches Hebdomadaires

- Vérifier les logs d'erreurs (Vercel)
- Vérifier les webhooks Stripe
- Monitorer les coûts OpenAI
- Répondre aux tickets support

### Tâches Mensuelles

- Analyser les métriques PostHog
- Optimiser les coûts API
- Mettre à jour les dépendances
- Backup manuel de la DB (en plus des automatiques)

### Tâches Trimestrielles

- Audit de sécurité
- Revue des performances
- Mise à jour majeure des dépendances
- Revue du pricing

---

## Ressources Utiles

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Upstash Docs](https://docs.upstash.com)

---

**Dernière mise à jour:** 10 Mars 2026
