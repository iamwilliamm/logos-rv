# Guide de Développement - Logos.rv

## 🚀 Démarrage Rapide

### Installation
```bash
cd /home/hp/logos-rv
npm install
```

### Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer .env.local avec vos clés
```

### Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
logos-rv/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Page d'accueil
│   │   └── globals.css   # Styles globaux
│   ├── components/       # Composants React
│   │   └── ui/           # Composants Shadcn/ui
│   ├── lib/              # Utilitaires
│   │   ├── prisma.ts     # Client Prisma
│   │   ├── auth.ts       # Configuration NextAuth
│   │   ├── utils.ts      # Utilitaires
│   │   └── validations.ts # Schémas Zod
│   └── types/            # Types TypeScript
├── prisma/
│   └── schema.prisma     # Schéma base de données
├── public/               # Assets statiques
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.example
```

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev              # Lancer le serveur dev
npm run build            # Build production
npm start                # Lancer le serveur prod

# Prisma
npm run prisma:generate  # Générer le client Prisma
npm run prisma:migrate   # Créer une migration
npm run prisma:studio    # Ouvrir Prisma Studio

# Linting & Formatting
npm run lint             # Linter le code
npm run type-check       # Vérifier les types
npm run format           # Formater le code
```

## 📝 Prochaines Étapes

### Semaine 1 : Setup & Auth
- [ ] Setup Prisma avec Neon
- [ ] Configurer NextAuth.js
- [ ] Créer pages login/register
- [ ] Implémenter Google OAuth

### Semaine 2-3 : Infrastructure IA
- [ ] Setup Upstash Vector + Redis
- [ ] Implémenter génération d'embeddings
- [ ] Créer pipeline d'indexation
- [ ] Interface admin upload

### Semaine 3-4 : Recherche IA
- [ ] Interface de recherche
- [ ] API endpoint /api/search
- [ ] Mode Q&A avec GPT-4
- [ ] Cache Redis

### Semaine 4-5 : Fiches de Prédication
- [ ] CRUD fiches
- [ ] Éditeur de fiches
- [ ] Sauvegarde automatique

### Semaine 5-6 : Dashboard & Freemium
- [ ] Page dashboard
- [ ] Intégration Stripe
- [ ] Gestion des limites

### Semaine 7 : Polish & Launch
- [ ] Tests E2E
- [ ] Optimisations
- [ ] Déploiement production

## 🔐 Variables d'Environnement

Voir `.env.example` pour la liste complète des variables nécessaires.

## 📚 Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [ARCHITECTURE_AI.md](./ARCHITECTURE_AI.md) - Architecture IA & RAG
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement
- [USER_STORIES.md](./USER_STORIES.md) - User stories détaillées
- [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage rapide

## 🤝 Contribution

1. Créer une branche feature (`git checkout -b feature/nom`)
2. Développer avec commits atomiques
3. Tester localement
4. Push et créer une PR
5. Review et merge

## 📞 Support

Pour des questions ou problèmes, consulte la documentation ou ouvre une issue sur GitHub.

---

**Bon développement ! 🚀**
