# Château Royal - Hôtel de Luxe 🏰

## 📋 Description
Application web moderne pour un hôtel de luxe avec système de réservation et dashboard administrateur.

**⚠️ MODE DÉMO : Ce projet fonctionne SANS base de données**
- Toutes les données (chambres, menus) sont fictives et intégrées dans le code
- Les connexions utilisateur sont simulées (aucune donnée n'est sauvegardée)
- Parfait pour tester l'interface et les fonctionnalités sans configuration

## ✨ Fonctionnalités
- 🛏️ Catalogue de 6 chambres de luxe avec images et descriptions
- 🍽️ Menu gastronomique avec 14 plats répartis en 4 catégories
- 👤 Système d'authentification fictif (2 utilisateurs de test)
- 🎨 Interface responsive et moderne avec animations
- 📱 Navigation fluide entre les pages

## 🔑 Identifiants de Connexion (Mode Démo)

### 👤 Utilisateur Standard
- **Nom d'utilisateur** : `user`
- **Mot de passe** : `user123`
- **Accès** : Consultation des chambres et du menu

### 🔐 Administrateur
- **Nom d'utilisateur** : `nazari`
- **Mot de passe** : `nazari123`
- **Accès** : Toutes les fonctionnalités + dashboard admin

> ⚠️ **Important** : Ces connexions sont purement fictives. Aucune donnée n'est enregistrée, aucune réservation n'est réellement effectuée, et aucune base de données n'est utilisée.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📂 Structure du Projet
```
src/
├── pages/
│   ├── Chambres.tsx    # Page des chambres (données démo intégrées)
│   ├── menu.tsx        # Page du menu restaurant (données démo)
│   └── ...
├── contexts/
│   └── AuthContext.tsx # Authentification fictive
└── components/
    └── ...
```

## 🎯 Utilisation

1. **Accueil** : Page d'accueil avec présentation de l'hôtel
2. **Se connecter** : Utiliser les identifiants ci-dessus
3. **Chambres** : Consulter les 6 chambres de luxe disponibles
4. **Menu** : Découvrir le menu gastronomique
5. **Dashboard Admin** : Accessible uniquement avec le compte `nazari`

## 🔧 Technologies Utilisées
- **React** 18.3 avec TypeScript
- **Vite** pour le build et le dev server
- **Tailwind CSS** pour le style
- **Framer Motion** pour les animations
- **React Router** pour la navigation

## 📝 Notes Importantes

### Mode Démo
- ✅ Toutes les images proviennent de Pexels (gratuites)
- ✅ Les données sont chargées instantanément (pas d'API)
- ✅ Aucune configuration requise
- ❌ Les réservations ne sont pas fonctionnelles (pas de paiement réel)
- ❌ Les modifications admin ne sont pas sauvegardées

### Pour une Version Production
Pour transformer ce projet en application réelle, il faudrait :
1. Configurer une base de données (Supabase recommandé)
2. Activer le système de paiement Stripe
3. Configurer les variables d'environnement
4. Déployer sur un serveur (Vercel, Netlify, etc.)

Consultez `SETUP_SUPABASE.md` pour plus d'informations.

## 🌐 Déploiement
Le projet peut être déployé sur :
- **Vercel** (recommandé)
- **Netlify**
- **Railway**

```bash
# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 📞 Support
Pour toute question sur le projet, consultez les fichiers de documentation :
- `SETUP_SUPABASE.md` - Guide de configuration base de données
- `INSTALLATION.md` - Guide d'installation détaillé

---

**Version** : 1.0.0 (Mode Démo)
**Dernière mise à jour** : 2025
**Type** : Application de démonstration (sans base de données)