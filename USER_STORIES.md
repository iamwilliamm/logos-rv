# User Stories - Logos.rv

## Légende
- **P0:** Critique (MVP)
- **P1:** Important (MVP)
- **P2:** Nice to have (Post-MVP)

---

## 1. AUTHENTIFICATION

### US-001: Inscription par Email (P0)
**En tant que** pasteur
**Je veux** créer un compte avec mon email et mot de passe
**Afin de** sauvegarder mes recherches et fiches de prédication

**Critères d'acceptation:**
- [ ] Formulaire avec email, mot de passe, confirmation mot de passe
- [ ] Validation: email valide, mot de passe min 8 caractères
- [ ] Message d'erreur si email déjà utilisé
- [ ] Email de confirmation envoyé
- [ ] Redirection vers dashboard après inscription
- [ ] Compte créé avec plan FREE par défaut

**Scénarios de test:**
1. Inscription réussie avec données valides
2. Erreur si email invalide
3. Erreur si mot de passe trop court
4. Erreur si email déjà existant
5. Email de confirmation reçu

---

### US-002: Connexion par Email (P0)
**En tant que** utilisateur existant
**Je veux** me connecter avec mon email et mot de passe
**Afin d'** accéder à mon compte

**Critères d'acceptation:**
- [ ] Formulaire avec email et mot de passe
- [ ] Message d'erreur si identifiants incorrects
- [ ] Session créée après connexion réussie
- [ ] Redirection vers dashboard
- [ ] Option "Se souvenir de moi"

---

### US-003: Connexion Google (P0)
**En tant que** utilisateur
**Je veux** me connecter avec mon compte Google
**Afin de** gagner du temps sans créer de mot de passe

**Critères d'acceptation:**
- [ ] Bouton "Continuer avec Google"
- [ ] Popup OAuth Google
- [ ] Création automatique du compte si nouveau
- [ ] Connexion si compte existant
- [ ] Redirection vers dashboard

---

### US-004: Réinitialisation Mot de Passe (P0)
**En tant que** utilisateur
**Je veux** réinitialiser mon mot de passe si je l'oublie
**Afin de** retrouver l'accès à mon compte

**Critères d'acceptation:**
- [ ] Lien "Mot de passe oublié ?" sur page login
- [ ] Formulaire avec email
- [ ] Email avec lien de réinitialisation envoyé
- [ ] Lien valide 1 heure
- [ ] Page pour définir nouveau mot de passe
- [ ] Confirmation et redirection vers login

---

### US-005: Déconnexion (P0)
**En tant que** utilisateur connecté
**Je veux** me déconnecter
**Afin de** sécuriser mon compte

**Critères d'acceptation:**
- [ ] Bouton "Déconnexion" dans menu utilisateur
- [ ] Session supprimée
- [ ] Redirection vers page d'accueil
- [ ] Impossible d'accéder aux pages protégées après déconnexion

---

## 2. RECHERCHE IA

### US-006: Recherche par Mots-Clés (P0)
**En tant que** pasteur
**Je veux** rechercher un thème ou mot-clé biblique
**Afin de** trouver des passages et enseignements pertinents

**Critères d'acceptation:**
- [ ] Barre de recherche visible sur page principale
- [ ] Placeholder: "Ex: foi, salut, Jean 3:16..."
- [ ] Bouton "Rechercher"
- [ ] Résultats affichés en <3 secondes
- [ ] Minimum 5 résultats pertinents
- [ ] Chaque résultat affiche: source, référence, extrait
- [ ] Possibilité de cliquer pour voir le texte complet

**Scénarios de test:**
1. Recherche "foi" retourne passages bibliques + prédications
2. Recherche "Jean 3:16" retourne le verset dans les 3 versions
3. Recherche vide affiche message d'erreur
4. Recherche sans résultats affiche message approprié

---

### US-007: Mode Question & Réponse (P0)
**En tant que** pasteur
**Je veux** poser une question théologique en langage naturel
**Afin d'** obtenir une réponse contextualisée avec sources

**Critères d'acceptation:**
- [ ] Toggle "Recherche" / "Q&A" sur interface
- [ ] Input texte pour la question
- [ ] Placeholder: "Ex: Que dit la Bible sur le pardon ?"
- [ ] Réponse générée en <5 secondes
- [ ] Réponse structurée et claire
- [ ] Citations avec références exactes
- [ ] Possibilité de copier la réponse
- [ ] Bouton "Ajouter à une fiche"

**Scénarios de test:**
1. Question "Qu'est-ce que la foi ?" retourne réponse avec versets
2. Question hors contexte biblique retourne message approprié
3. Réponse cite au moins 3 sources différentes

---

### US-008: Filtrage par Source (P1)
**En tant que** pasteur
**Je veux** filtrer les résultats par source
**Afin de** me concentrer sur une Bible ou les prédications

**Critères d'acceptation:**
- [ ] Checkboxes: Darby, Segond, Martin, Branham, Pasteur
- [ ] Filtres appliqués en temps réel
- [ ] Compteur de résultats par source
- [ ] Possibilité de sélectionner/désélectionner tout
- [ ] Filtres sauvegardés dans la session

---

### US-009: Historique des Recherches (P1)
**En tant que** pasteur
**Je veux** voir mes recherches récentes
**Afin de** retrouver rapidement une recherche passée

**Critères d'acceptation:**
- [ ] Section "Recherches récentes" sur dashboard
- [ ] Affiche les 10 dernières recherches
- [ ] Chaque entrée: query, date, nombre de résultats
- [ ] Clic sur une recherche relance la recherche
- [ ] Possibilité de supprimer une recherche de l'historique

---

### US-010: Sauvegarde de Résultats (P1)
**En tant que** pasteur
**Je veux** sauvegarder des résultats de recherche
**Afin de** les retrouver plus tard ou les ajouter à une fiche

**Critères d'acceptation:**
- [ ] Icône "Sauvegarder" sur chaque résultat
- [ ] Résultats sauvegardés accessibles depuis dashboard
- [ ] Possibilité d'ajouter une note personnelle
- [ ] Bouton "Ajouter à une fiche" sur résultat sauvegardé

---

## 3. FICHES DE PRÉDICATION

### US-011: Créer une Fiche (P0)
**En tant que** pasteur
**Je veux** créer une nouvelle fiche de prédication
**Afin d'** organiser ma préparation

**Critères d'acceptation:**
- [ ] Bouton "Nouvelle fiche" sur dashboard
- [ ] Formulaire: titre (requis), thème (optionnel)
- [ ] Fiche créée avec structure vide
- [ ] Redirection vers éditeur de fiche
- [ ] Sauvegarde automatique toutes les 30s

---

### US-012: Éditer une Fiche (P0)
**En tant que** pasteur
**Je veux** éditer le contenu de ma fiche
**Afin de** structurer mon message

**Critères d'acceptation:**
- [ ] Éditeur de texte riche (gras, italique, listes)
- [ ] Sections: Titre, Thème, Versets principaux, Plan, Notes
- [ ] Ajout de versets avec sélection de version
- [ ] Création de points de plan (drag & drop pour réorganiser)
- [ ] Zone de notes personnelles
- [ ] Indicateur "Sauvegardé" / "En cours de sauvegarde"

---

### US-013: Ajouter des Versets (P0)
**En tant que** pasteur
**Je veux** ajouter des versets à ma fiche
**Afin de** structurer mon message autour des Écritures

**Critères d'acceptation:**
- [ ] Bouton "Ajouter un verset"
- [ ] Recherche rapide de verset (référence ou mots-clés)
- [ ] Sélection de la version (Darby, Segond, Martin)
- [ ] Verset ajouté avec référence et texte
- [ ] Possibilité de supprimer un verset
- [ ] Possibilité de réorganiser les versets (drag & drop)

---

### US-014: Créer un Plan (P0)
**En tant que** pasteur
**Je veux** créer un plan structuré pour ma prédication
**Afin d'** organiser mes idées

**Critères d'acceptation:**
- [ ] Section "Plan" avec points numérotés
- [ ] Bouton "Ajouter un point"
- [ ] Chaque point: titre + contenu + versets associés
- [ ] Réorganisation par drag & drop
- [ ] Indentation possible (sous-points)
- [ ] Suppression de points

---

### US-015: Lister mes Fiches (P0)
**En tant que** pasteur
**Je veux** voir toutes mes fiches
**Afin de** retrouver une préparation passée

**Critères d'acceptation:**
- [ ] Page "Mes fiches" avec liste complète
- [ ] Affichage: titre, thème, date de création, date de modification
- [ ] Tri par: date création, date modification, titre
- [ ] Recherche par titre ou thème
- [ ] Pagination (20 fiches par page)
- [ ] Clic sur une fiche ouvre l'éditeur

---

### US-016: Supprimer une Fiche (P0)
**En tant que** pasteur
**Je veux** supprimer une fiche
**Afin de** nettoyer mes anciennes préparations

**Critères d'acceptation:**
- [ ] Bouton "Supprimer" sur chaque fiche
- [ ] Modal de confirmation: "Êtes-vous sûr ?"
- [ ] Suppression définitive après confirmation
- [ ] Message de succès
- [ ] Fiche retirée de la liste

---

### US-017: Dupliquer une Fiche (P2)
**En tant que** pasteur
**Je veux** dupliquer une fiche existante
**Afin de** réutiliser une structure pour un nouveau message

**Critères d'acceptation:**
- [ ] Bouton "Dupliquer" sur chaque fiche
- [ ] Nouvelle fiche créée avec suffixe " (Copie)"
- [ ] Tout le contenu copié
- [ ] Redirection vers la nouvelle fiche

---

## 4. DASHBOARD

### US-018: Voir mon Dashboard (P1)
**En tant que** pasteur connecté
**Je veux** voir un tableau de bord
**Afin d'** accéder rapidement à mes ressources

**Critères d'acceptation:**
- [ ] Widget "Fiches récentes" (5 dernières)
- [ ] Widget "Recherches récentes" (5 dernières)
- [ ] Widget "Statistiques": nombre de fiches, recherches ce mois
- [ ] Boutons d'action rapide: "Nouvelle recherche", "Nouvelle fiche"
- [ ] Affichage du plan actuel (FREE/PREMIUM)
- [ ] Si FREE: affichage des limites (X/10 recherches aujourd'hui)

---

### US-019: Voir mes Statistiques (P1)
**En tant que** pasteur
**Je veux** voir mes statistiques d'utilisation
**Afin de** suivre mon activité

**Critères d'acceptation:**
- [ ] Nombre total de fiches créées
- [ ] Nombre total de recherches effectuées
- [ ] Recherches ce mois
- [ ] Fiches créées ce mois
- [ ] Date de dernière activité
- [ ] Graphique d'activité (optionnel)

---

## 5. ADMINISTRATION

### US-020: Uploader des Prédications (P1)
**En tant qu'** admin
**Je veux** uploader des fichiers de prédications
**Afin de** les rendre disponibles pour la recherche

**Critères d'acceptation:**
- [ ] Page admin protégée (role ADMIN uniquement)
- [ ] Upload multiple de fichiers (.txt, .docx, .pptx)
- [ ] Sélection de la source (Branham ou Pasteur)
- [ ] Champ titre pour chaque fichier
- [ ] Champ metadata (date, lieu, etc.)
- [ ] Barre de progression pendant upload
- [ ] Message de succès après upload
- [ ] Indexation automatique en arrière-plan

---

### US-021: Voir le Statut d'Indexation (P1)
**En tant qu'** admin
**Je veux** voir le statut d'indexation des documents
**Afin de** m'assurer que tout est indexé

**Critères d'acceptation:**
- [ ] Liste de tous les documents uploadés
- [ ] Colonnes: titre, source, statut (En cours/Indexé/Erreur), date
- [ ] Filtre par statut
- [ ] Filtre par source
- [ ] Possibilité de réindexer un document
- [ ] Possibilité de supprimer un document

---

### US-022: Gérer les Utilisateurs (P2)
**En tant qu'** admin
**Je veux** voir et gérer les utilisateurs
**Afin de** modérer la plateforme

**Critères d'acceptation:**
- [ ] Liste de tous les utilisateurs
- [ ] Colonnes: email, nom, plan, date inscription, dernière activité
- [ ] Recherche par email
- [ ] Possibilité de changer le plan d'un utilisateur
- [ ] Possibilité de désactiver un compte
- [ ] Statistiques globales: total users, FREE, PREMIUM

---

## 6. FREEMIUM & PAIEMENTS

### US-023: Voir les Limites de mon Plan (P1)
**En tant qu'** utilisateur FREE
**Je veux** voir mes limites d'utilisation
**Afin de** savoir quand passer en PREMIUM

**Critères d'acceptation:**
- [ ] Badge "Plan Gratuit" sur dashboard
- [ ] Compteur: "X/10 recherches aujourd'hui"
- [ ] Compteur: "X/5 fiches créées"
- [ ] Message quand limite atteinte
- [ ] Bouton "Passer à Premium" visible

---

### US-024: Voir la Page Pricing (P1)
**En tant que** visiteur ou utilisateur
**Je veux** voir les différents plans
**Afin de** comparer et choisir

**Critères d'acceptation:**
- [ ] Page /pricing accessible publiquement
- [ ] Tableau comparatif FREE vs PREMIUM
- [ ] Prix affiché: 9.99€/mois
- [ ] Liste des fonctionnalités de chaque plan
- [ ] Bouton "Commencer gratuitement" (FREE)
- [ ] Bouton "Passer à Premium" (PREMIUM)

---

### US-025: Souscrire à Premium (P1)
**En tant qu'** utilisateur FREE
**Je veux** souscrire au plan PREMIUM
**Afin de** débloquer toutes les fonctionnalités

**Critères d'acceptation:**
- [ ] Clic sur "Passer à Premium" redirige vers Stripe Checkout
- [ ] Formulaire de paiement Stripe sécurisé
- [ ] Paiement par carte bancaire
- [ ] Confirmation de paiement
- [ ] Redirection vers dashboard
- [ ] Plan mis à jour en PREMIUM
- [ ] Email de confirmation reçu

---

### US-026: Gérer mon Abonnement (P1)
**En tant qu'** utilisateur PREMIUM
**Je veux** gérer mon abonnement
**Afin de** le modifier ou l'annuler

**Critères d'acceptation:**
- [ ] Page "Mon abonnement" dans paramètres
- [ ] Affichage: plan actuel, prix, date de renouvellement
- [ ] Bouton "Gérer mon abonnement" (Stripe Customer Portal)
- [ ] Possibilité de mettre à jour la carte
- [ ] Possibilité d'annuler l'abonnement
- [ ] Si annulé: accès jusqu'à la fin de la période payée

---

### US-027: Recevoir une Facture (P1)
**En tant qu'** utilisateur PREMIUM
**Je veux** recevoir mes factures par email
**Afin de** les conserver pour ma comptabilité

**Critères d'acceptation:**
- [ ] Email automatique après chaque paiement
- [ ] Facture en PDF jointe
- [ ] Détails: montant, date, période couverte
- [ ] Accès aux factures dans "Mon abonnement"

---

## 7. PARAMÈTRES

### US-028: Modifier mon Profil (P2)
**En tant qu'** utilisateur
**Je veux** modifier mes informations
**Afin de** garder mon profil à jour

**Critères d'acceptation:**
- [ ] Page "Paramètres" > "Profil"
- [ ] Champs: nom, email, photo
- [ ] Validation email si changement
- [ ] Bouton "Sauvegarder"
- [ ] Message de confirmation

---

### US-029: Changer mon Mot de Passe (P2)
**En tant qu'** utilisateur
**Je veux** changer mon mot de passe
**Afin de** sécuriser mon compte

**Critères d'acceptation:**
- [ ] Page "Paramètres" > "Sécurité"
- [ ] Champs: ancien mot de passe, nouveau, confirmation
- [ ] Validation: ancien mot de passe correct
- [ ] Validation: nouveau mot de passe min 8 caractères
- [ ] Message de confirmation
- [ ] Déconnexion automatique après changement

---

### US-030: Supprimer mon Compte (P2)
**En tant qu'** utilisateur
**Je veux** supprimer mon compte
**Afin de** retirer mes données de la plateforme

**Critères d'acceptation:**
- [ ] Page "Paramètres" > "Compte"
- [ ] Bouton "Supprimer mon compte" en rouge
- [ ] Modal de confirmation avec avertissement
- [ ] Champ: "Tapez DELETE pour confirmer"
- [ ] Suppression de toutes les données (RGPD)
- [ ] Annulation de l'abonnement si PREMIUM
- [ ] Email de confirmation de suppression

---

## 8. FONCTIONNALITÉS POST-MVP

### US-031: Exporter une Fiche en PDF (P2)
**En tant qu'** utilisateur PREMIUM
**Je veux** exporter ma fiche en PDF
**Afin de** l'imprimer ou la partager

**Critères d'acceptation:**
- [ ] Bouton "Exporter en PDF" sur fiche
- [ ] PDF généré avec mise en page propre
- [ ] Inclut: titre, thème, versets, plan, notes
- [ ] Téléchargement automatique

---

### US-032: Partager une Fiche (P2)
**En tant qu'** utilisateur
**Je veux** partager une fiche avec un autre utilisateur
**Afin de** collaborer

**Critères d'acceptation:**
- [ ] Bouton "Partager" sur fiche
- [ ] Input email du destinataire
- [ ] Email envoyé avec lien vers la fiche
- [ ] Fiche accessible en lecture seule pour le destinataire
- [ ] Possibilité de révoquer l'accès

---

### US-033: Recherche Vocale (P2)
**En tant qu'** utilisateur
**Je veux** effectuer une recherche vocale
**Afin de** gagner du temps

**Critères d'acceptation:**
- [ ] Icône micro sur barre de recherche
- [ ] Enregistrement de la voix
- [ ] Transcription en texte
- [ ] Lancement automatique de la recherche

---

## Résumé des Priorités

**P0 (Critique - MVP):** 17 user stories
**P1 (Important - MVP):** 10 user stories
**P2 (Post-MVP):** 6 user stories

**Total:** 33 user stories
