# PRD - Logos.rv

## Product Requirements Document

**Version:** 1.0 MVP
**Date:** 10 Mars 2026
**Statut:** Draft Initial

---

## 1. Vision du Produit

### 1.1 Résumé Exécutif

Logos.rv est une plateforme web qui permet aux pasteurs et prédicateurs de faire des recherches bibliques approfondies assistées par IA et de créer des fiches de prédication structurées. L'application s'appuie sur un corpus unique combinant plusieurs versions de la Bible (Darby, Segond, Martin), les prédications de William Marrion Branham, et les enseignements d'un pasteur local.

### 1.2 Problème à Résoudre

Les pasteurs et prédicateurs passent des heures à :

- Rechercher des passages bibliques pertinents pour leurs messages
- Croiser différentes versions de la Bible
- Trouver des enseignements connexes dans les prédications de référence
- Organiser leurs notes de prédication de manière structurée
- Préparer des messages cohérents et bibliquement fondés

### 1.3 Solution Proposée

Une plateforme tout-en-un qui :

- Utilise l'IA pour effectuer des recherches sémantiques dans un corpus biblique et homilétique
- Permet de poser des questions théologiques et d'obtenir des réponses contextualisées
- Offre un système de fiches de prédication pour organiser et sauvegarder les préparations
- Centralise l'accès aux ressources bibliques et aux enseignements de référence

---

## 2. Public Cible

### 2.1 Persona Principal

**Pasteur Pierre - 35-55 ans**

- Pasteur d'église locale
- Prépare 2-3 messages par semaine
- Utilise principalement la Bible en français (Darby, Segond, Martin)
- Suit les enseignements de William Branham
- Cherche à gagner du temps dans sa préparation
- Veut des messages bibliquement solides et bien structurés

### 2.2 Besoins Utilisateurs

- Recherche rapide et pertinente dans les Écritures
- Accès aux enseignements de William Branham sur des thèmes spécifiques
- Organisation de ses notes de prédication
- Sauvegarde et réutilisation de ses préparations
- Interface simple et intuitive

---

## 3. Fonctionnalités du MVP

### 3.1 Authentification (NextAuth.js)

**Priorité:** P0 (Critique)

**User Stories:**

- En tant qu'utilisateur, je veux créer un compte avec mon email
- En tant qu'utilisateur, je veux me connecter avec Google
- En tant qu'utilisateur, je veux réinitialiser mon mot de passe

**Spécifications Techniques:**

- NextAuth.js avec providers: Email/Password, Google
- Session management avec JWT
- Protection des routes API et pages

**Critères d'Acceptation:**

- [ ] Inscription fonctionnelle avec email/password
- [ ] Connexion Google opérationnelle
- [ ] Reset password par email
- [ ] Sessions persistantes
- [ ] Redirection automatique si non authentifié

---

### 3.2 Recherche IA Biblique

**Priorité:** P0 (Critique)

**User Stories:**

- En tant que pasteur, je veux rechercher un thème biblique et obtenir des résultats pertinents
- En tant que pasteur, je veux poser une question théologique et recevoir une réponse basée sur les sources
- En tant que pasteur, je veux voir les références exactes (Bible, prédication Branham, pasteur)

**Spécifications Techniques:**

- Interface de recherche avec input texte
- Deux modes:
  - **Mode Recherche:** Mots-clés, thèmes, versets
  - **Mode Q&A:** Questions en langage naturel
- Intégration API IA (OpenAI GPT-4 ou Claude via API)
- RAG (Retrieval Augmented Generation) avec embeddings vectoriels
- Base de données vectorielle (Upstash Vector ou Pinecone)
- Sources indexées:
  - Bible Darby (texte complet)
  - Bible Segond (texte complet)
  - Bible Martin (texte complet)
  - Prédications William Branham (fichiers txt/docx/pptx)
  - Prédications du pasteur (fichiers txt/docx/pptx)

**Critères d'Acceptation:**

- [ ] Recherche par mot-clé retourne résultats pertinents en <3s
- [ ] Q&A retourne réponse contextualisée avec sources
- [ ] Affichage des références exactes (livre, chapitre, verset OU titre prédication + date)
- [ ] Possibilité de filtrer par source (Bible, Branham, Pasteur)
- [ ] Historique des recherches sauvegardé

---

### 3.3 Fiches de Prédication

**Priorité:** P0 (Critique)

**User Stories:**

- En tant que pasteur, je veux créer une nouvelle fiche de prédication
- En tant que pasteur, je veux sauvegarder mes résultats de recherche dans une fiche
- En tant que pasteur, je veux éditer et organiser mes fiches
- En tant que pasteur, je veux retrouver mes anciennes fiches

**Structure d'une Fiche:**

```typescript
interface PredictionSheet {
  id: string
  userId: string
  title: string
  theme: string
  mainVerses: Verse[]
  outline: OutlinePoint[]
  notes: string
  searchResults: SearchResult[]
  createdAt: Date
  updatedAt: Date
}

interface Verse {
  reference: string // Ex: "Jean 3:16"
  version: "darby" | "segond" | "martin"
  text: string
}

interface OutlinePoint {
  order: number
  title: string
  content: string
  verses: Verse[]
}
```

**Spécifications Techniques:**

- CRUD complet sur les fiches (Create, Read, Update, Delete)
- Éditeur de texte riche (TipTap ou Lexical)
- Drag & drop pour réorganiser le plan
- Ajout rapide de versets depuis les résultats de recherche
- Stockage PostgreSQL via Prisma

**Critères d'Acceptation:**

- [ ] Création de fiche avec titre et thème
- [ ] Ajout de versets avec sélection de version
- [ ] Création d'un plan structuré (points 1, 2, 3...)
- [ ] Zone de notes personnelles
- [ ] Sauvegarde automatique toutes les 30s
- [ ] Liste de toutes mes fiches avec recherche
- [ ] Suppression de fiche avec confirmation

---

### 3.4 Dashboard Utilisateur

**Priorité:** P1 (Important)

**User Stories:**

- En tant que pasteur, je veux voir mes fiches récentes
- En tant que pasteur, je veux accéder rapidement à la recherche
- En tant que pasteur, je veux voir mes statistiques d'utilisation

**Spécifications Techniques:**

- Page d'accueil après login
- Widgets:
  - Fiches récentes (5 dernières)
  - Recherches récentes (5 dernières)
  - Statistiques: nombre de fiches, recherches ce mois
  - Accès rapide: "Nouvelle recherche", "Nouvelle fiche"

**Critères d'Acceptation:**

- [ ] Affichage des 5 dernières fiches
- [ ] Affichage des 5 dernières recherches
- [ ] Boutons d'action rapide fonctionnels
- [ ] Statistiques basiques affichées

---

### 3.5 Gestion du Contenu (Admin)

**Priorité:** P1 (Important)

**User Stories:**

- En tant qu'admin, je veux uploader les prédications de William Branham
- En tant qu'admin, je veux uploader les prédications de mon pasteur
- En tant qu'admin, je veux voir le statut de l'indexation

**Spécifications Techniques:**

- Interface admin protégée (role-based access)
- Upload de fichiers: .txt, .docx, .pptx
- Parsing automatique des fichiers
- Génération d'embeddings vectoriels
- Stockage dans Upstash Vector ou Pinecone
- Job queue avec Inngest pour traitement asynchrone

**Critères d'Acceptation:**

- [ ] Upload multiple de fichiers
- [ ] Parsing automatique du contenu
- [ ] Indexation vectorielle réussie
- [ ] Dashboard admin avec statut des documents
- [ ] Possibilité de supprimer/réindexer un document

---

## 4. Modèle de Monétisation (Freemium)

### 4.1 Plan Gratuit

**Limites:**

- 10 recherches par jour
- 5 fiches de prédication maximum
- Accès aux 3 versions de la Bible
- Accès limité aux prédications Branham (extraits)

### 4.2 Plan Premium (9.99€/mois)

**Avantages:**

- Recherches illimitées
- Fiches illimitées
- Accès complet aux prédications Branham
- Accès aux prédications du pasteur
- Export PDF des fiches
- Support prioritaire

### 4.3 Intégration Stripe

- Checkout Stripe pour abonnement
- Webhooks pour gestion des abonnements
- Gestion des essais gratuits (14 jours)

---

## 5. Stack Technique

### 5.1 Frontend

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Forms:** React Hook Form + Zod
- **State Management:** React Context + Zustand (si nécessaire)

### 5.2 Backend

- **Framework:** Next.js API Routes (App Router)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Cache:** Upstash Redis
- **Vector DB:** Upstash Vector ou Pinecone
- **Background Jobs:** Inngest
- **File Storage:** Vercel Blob ou AWS S3

### 5.3 Authentification & Paiements

- **Auth:** NextAuth.js (Auth.js)
- **Payments:** Stripe

### 5.4 IA & Embeddings

- **LLM API:** OpenAI GPT-4 ou Anthropic Claude
- **Embeddings:** OpenAI text-embedding-3-large
- **RAG Framework:** LangChain ou custom implementation

### 5.5 Déploiement & Monitoring

- **Hosting:** Vercel
- **Analytics:** PostHog
- **Error Tracking:** Sentry (optionnel)
- **Domain:** Porkbun

---

## 6. Architecture Technique

### 6.1 Structure du Projet

```
logos-rv/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── search/
│   │   │   ├── sheets/
│   │   │   └── settings/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── search/
│   │   │   ├── sheets/
│   │   │   ├── upload/
│   │   │   └── webhooks/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── search/
│   │   ├── sheets/
│   │   └── layout/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── ai/
│   │   │   ├── embeddings.ts
│   │   │   ├── search.ts
│   │   │   └── qa.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   └── types/
├── prisma/
│   └── schema.prisma
├── public/
└── package.json
```

### 6.2 Schéma Base de Données (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  role          Role      @default(USER)
  plan          Plan      @default(FREE)
  stripeCustomerId String?
  sheets        Sheet[]
  searches      Search[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

enum Plan {
  FREE
  PREMIUM
}

model Sheet {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  theme       String?
  mainVerses  Json     // Verse[]
  outline     Json     // OutlinePoint[]
  notes       String?  @db.Text
  searchResults Json?  // SearchResult[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Search {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  query     String
  mode      SearchMode
  results   Json     // SearchResult[]
  createdAt DateTime @default(now())
}

enum SearchMode {
  SEARCH
  QA
}

model Document {
  id          String   @id @default(cuid())
  title       String
  source      Source
  content     String   @db.Text
  metadata    Json?
  vectorId    String?  // ID dans la vector DB
  indexed     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Source {
  BIBLE_DARBY
  BIBLE_SEGOND
  BIBLE_MARTIN
  BRANHAM
  PASTOR
}
```

### 6.3 Flow de Recherche IA

```
1. User entre une query
2. Frontend → POST /api/search
3. Backend:
   a. Génère embedding de la query (OpenAI)
   b. Recherche vectorielle (Upstash Vector)
   c. Récupère top 10 documents pertinents
   d. Si mode Q&A:
      - Envoie query + contexte à GPT-4/Claude
      - Génère réponse avec citations
   e. Sauvegarde la recherche en DB
4. Retourne résultats au frontend
5. Frontend affiche résultats + sources
```

### 6.4 Flow d'Upload de Documents

```
1. Admin upload fichiers (.txt, .docx, .pptx)
2. Frontend → POST /api/upload
3. Backend:
   a. Sauvegarde fichiers (Vercel Blob)
   b. Crée job Inngest pour traitement
4. Job Inngest:
   a. Parse le fichier (mammoth pour .docx, etc.)
   b. Découpe en chunks (500-1000 tokens)
   c. Génère embeddings pour chaque chunk
   d. Stocke dans Upstash Vector
   e. Crée entrée Document en DB
5. Admin voit statut "Indexed" dans dashboard
```

---

## 7. Roadmap MVP

### Phase 1 - Setup (Semaine 1)

- [ ] Initialiser projet Next.js + TypeScript
- [ ] Setup Tailwind + Shadcn/ui
- [ ] Configurer Prisma + Neon PostgreSQL
- [ ] Setup NextAuth.js (Email + Google)
- [ ] Déployer sur Vercel (environnement dev)

### Phase 2 - Authentification (Semaine 1-2)

- [ ] Pages login/register/reset-password
- [ ] Middleware de protection des routes
- [ ] Gestion des sessions
- [ ] Tests authentification

### Phase 3 - Upload & Indexation (Semaine 2-3)

- [ ] Interface admin upload
- [ ] Parser fichiers txt/docx/pptx
- [ ] Setup Upstash Vector
- [ ] Génération embeddings (OpenAI)
- [ ] Job Inngest pour indexation
- [ ] Indexer les 3 Bibles + prédications

### Phase 4 - Recherche IA (Semaine 3-4)

- [ ] Interface de recherche
- [ ] API endpoint /api/search
- [ ] Recherche vectorielle
- [ ] Mode Q&A avec GPT-4/Claude
- [ ] Affichage des résultats + sources
- [ ] Historique des recherches

### Phase 5 - Fiches de Prédication (Semaine 4-5)

- [ ] CRUD fiches
- [ ] Éditeur de fiches (TipTap)
- [ ] Ajout versets depuis recherche
- [ ] Sauvegarde automatique
- [ ] Liste des fiches

### Phase 6 - Dashboard (Semaine 5)

- [ ] Page dashboard
- [ ] Widgets fiches récentes
- [ ] Widgets recherches récentes
- [ ] Statistiques basiques

### Phase 7 - Freemium & Stripe (Semaine 6)

- [ ] Limites plan gratuit
- [ ] Page pricing
- [ ] Intégration Stripe Checkout
- [ ] Webhooks Stripe
- [ ] Gestion abonnements

### Phase 8 - Polish & Launch (Semaine 7)

- [ ] Tests end-to-end
- [ ] Optimisations performance
- [ ] Setup PostHog analytics
- [ ] Documentation utilisateur
- [ ] Déploiement production
- [ ] Lancement beta privée

---

## 8. Métriques de Succès

### 8.1 Métriques Produit (3 premiers mois)

- **Acquisition:** 100 utilisateurs inscrits
- **Activation:** 60% créent au moins 1 fiche
- **Rétention:** 40% reviennent après 7 jours
- **Conversion:** 10% passent en Premium

### 8.2 Métriques Techniques

- **Performance:** Recherche < 3s
- **Uptime:** 99.5%
- **Erreurs:** < 1% des requêtes

### 8.3 Métriques Utilisateur

- **Satisfaction:** NPS > 40
- **Usage:** Moyenne 3 recherches/session
- **Engagement:** 2 fiches créées/utilisateur/mois

---

## 9. Risques & Mitigations

### 9.1 Risques Techniques

| Risque                      | Impact | Probabilité | Mitigation                                 |
| --------------------------- | ------ | ----------- | ------------------------------------------ |
| Coût API IA élevé           | Haut   | Moyen       | Limiter requêtes plan gratuit, cache Redis |
| Performance recherche lente | Moyen  | Faible      | Optimiser embeddings, indexation           |
| Parsing fichiers échoue     | Moyen  | Moyen       | Validation upload, retry logic             |

### 9.2 Risques Produit

| Risque                             | Impact | Probabilité | Mitigation                           |
| ---------------------------------- | ------ | ----------- | ------------------------------------ |
| Faible adoption                    | Haut   | Moyen       | Beta privée, feedback early users    |
| Qualité réponses IA insuffisante   | Haut   | Moyen       | Fine-tuning prompts, RAG optimisé    |
| Concurrence (Logos Bible Software) | Moyen  | Faible      | Focus niche Branham, prix accessible |

---

## 10. Prochaines Étapes

### Immédiat

1. Valider ce PRD avec les stakeholders
2. Créer le repo GitHub
3. Initialiser le projet Next.js
4. Setup environnements (dev, staging, prod)

### Court Terme (Post-MVP)

- Export PDF des fiches
- Partage de fiches entre utilisateurs
- Version mobile (PWA)
- Recherche vocale
- Intégration calendrier (planning prédications)

### Long Terme

- Application mobile native (React Native)
- Collaboration en temps réel
- Bibliothèque de prédications communautaire
- Support multilingue (anglais, espagnol)
- Intégration avec logiciels de présentation (PowerPoint, Keynote)

---

## 11. Annexes

### 11.1 Références

- William Marrion Branham: https://branham.org
- Bible Darby: Domaine public
- Bible Segond: Domaine public
- Bible Martin: Domaine public

### 11.2 Glossaire

- **RAG:** Retrieval Augmented Generation - Technique d'IA combinant recherche et génération
- **Embedding:** Représentation vectorielle d'un texte pour recherche sémantique
- **Vector DB:** Base de données optimisée pour recherche vectorielle
- **Freemium:** Modèle gratuit avec options payantes

---

**Document maintenu par:** [Ton nom]
**Dernière mise à jour:** 10 Mars 2026
**Version:** 1.0 MVP
