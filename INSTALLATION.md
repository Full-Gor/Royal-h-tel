# 🏰 Installation Château Royal - Guide Complet

## 📋 Prérequis

### ✅ Logiciels nécessaires :
- **Node.js 18+** : [Télécharger ici](https://nodejs.org/)
- **WAMP Server** : Déjà installé ✅
- **Git** (optionnel) : Pour cloner le projet

### 🔧 Vérifications :
```bash
# Vérifier Node.js
node --version
# Doit afficher v18.x.x ou plus

# Vérifier npm
npm --version
# Doit afficher 8.x.x ou plus
```

## 🚀 Installation Étape par Étape

### 1. 📁 Télécharger le Projet
```bash
# Option A: Télécharger le ZIP et extraire
# Extraire dans: C:\Users\VotreNom\Desktop\chateau-royal

# Option B: Cloner avec Git
git clone [URL_DU_PROJET] chateau-royal
cd chateau-royal
```

### 2. 📦 Installer les Dépendances
```bash
# Dans le dossier du projet
npm install
```

### 3. 🗄️ Configurer la Base de Données

#### A. Créer la base dans phpMyAdmin :
1. Ouvrir **phpMyAdmin** : `http://localhost/phpmyadmin`
2. Cliquer sur **"Nouvelle base de données"**
3. Nom : `chateau_royal`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer **"Créer"**

#### B. Importer le schéma :
1. Sélectionner la base `chateau_royal`
2. Onglet **"Importer"**
3. Choisir le fichier : `database/schema.sql`
4. Cliquer **"Exécuter"**

### 4. ⚙️ Configuration Environnement
```bash
# Copier le fichier d'exemple
copy .env.example .env

# Éditer le fichier .env avec vos paramètres
```

#### Contenu du fichier `.env` :
```env
# Configuration pour WAMP Server
VITE_SITE_MODE=mysql

# Base de données MySQL
VITE_DB_HOST=localhost
VITE_DB_USER=root
VITE_DB_PASSWORD=
VITE_DB_NAME=chateau_royal
VITE_DB_PORT=3306
```

### 5. 🎯 Lancer l'Application
```bash
# Démarrer le serveur de développement
npm run dev
```

### 6. 🌐 Accéder au Site
- **URL** : `http://localhost:5173`
- **Admin** : `admin@chateauroyal.com` / `admin123`

## 📊 Structure du Projet

```
chateau-royal/
├── src/                    # Code source React
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages principales
│   ├── contexts/          # Contextes React
│   └── lib/               # Services et utilitaires
├── database/              # Schéma SQL
├── public/                # Fichiers statiques
├── .env                   # Configuration
└── package.json           # Dépendances
```

## 🔧 Fonctionnalités Disponibles

### ✅ **Authentification :**
- Inscription/Connexion sécurisée
- Gestion des profils utilisateurs
- Système d'administration

### ✅ **Gestion des Chambres :**
- Catalogue complet avec images
- Système de réservation
- Tarifs modulables (nuit/semaine/mois)

### ✅ **Dashboard Admin :**
- CRUD complet des chambres
- Gestion des utilisateurs
- Statistiques en temps réel
- Messages de contact

### ✅ **Système de Contact :**
- Formulaire sécurisé
- Sauvegarde en base de données
- Interface admin pour les réponses

## 🛠️ Dépannage

### ❌ **Erreur de connexion MySQL :**
```bash
# Vérifier que WAMP est démarré
# Services : Apache + MySQL doivent être verts

# Vérifier les paramètres dans .env
VITE_DB_HOST=localhost
VITE_DB_USER=root
VITE_DB_PASSWORD=    # Laisser vide si pas de mot de passe
```

### ❌ **Port déjà utilisé :**
```bash
# Si le port 5173 est occupé
npm run dev -- --port 3000
```

### ❌ **Erreur d'installation npm :**
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules
npm install
```

## 📞 Support

### 🆘 **Problèmes courants :**
1. **WAMP non démarré** → Vérifier les services
2. **Base non créée** → Suivre l'étape 3 exactement
3. **Port occupé** → Changer le port avec `--port`
4. **Erreur .env** → Vérifier la syntaxe du fichier

### 📧 **Contact :**
- **Propriétaire** : Arnaud Barotteaux
- **Téléphone** : 06 44 76 27 21
- **Email** : contact@chateauroyal.com

## 🎉 **Félicitations !**

Votre site Château Royal est maintenant opérationnel !

**Accès :**
- **Site public** : `http://localhost:5173`
- **Admin** : `admin@chateauroyal.com` / `admin123`
- **phpMyAdmin** : `http://localhost/phpmyadmin`

**Prochaines étapes :**
1. Tester toutes les fonctionnalités
2. Personnaliser les contenus
3. Ajouter vos propres chambres
4. Configurer Stripe pour les paiements (optionnel)