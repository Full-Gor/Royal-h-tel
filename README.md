# Château Royal - Hôtel de Luxe

## 🏰 Description
Application web moderne pour un hôtel de luxe avec système de réservation, paiement Stripe, et dashboard administrateur.

## ✨ Fonctionnalités
- Réservation de chambres avec paiement Stripe
- Dashboard administrateur complet
- Système d'authentification sécurisé
- Interface responsive et moderne
- Gestion des messages de contact

## 🔒 Sécurité
- Protection contre les injections SQL et XSS
- Authentification forte avec mots de passe complexes
- Audit logs et détection de comportements suspects
- Sécurisation des formulaires (CSRF, honeypot, rate limiting)
- Mise à jour automatique des dépendances
- Plan de réponse aux incidents documenté

## 🚀 Déploiement
- Déployé sur Vercel avec HTTPS automatique
- Base de données Supabase avec RLS
- Variables d'environnement sécurisées

## 📝 Dernière mise à jour
- Système de sécurité complet implémenté
- Protection des formulaires contre le spam et les attaques
- Mise à jour automatique des dépendances critiques
- Plan de réponse aux incidents documenté

## 🔧 Problèmes résolus
- **Multiple GoTrueClient instances** : Suppression de l'instance Supabase redondante dans main.tsx
- **Authentification admin** : L'utilisateur admin correct est `admin@chateauroyal.com` (pas admin2102)
- **Mot de passe admin** : Doit respecter les nouvelles règles strictes (12+ caractères, majuscules, minuscules, chiffres, symboles)

## 🌐 URL de déploiement
- **URL actuelle** : `royal-h-tel.vercel.app`
- **URL précédente** : `royal-h-tel-9aa8.vercel.app`
- **Raison du changement** : Vercel peut générer de nouvelles URLs lors des redéploiements ou changements de configuration

## 👤 Compte Admin
- **Email** : `admin@chateauroyal.com`
- **Mot de passe** : Doit respecter les règles de sécurité strictes
- **Exemple de mot de passe valide** : `Admin123!@#`

---
*Dernière modification : $(date)*