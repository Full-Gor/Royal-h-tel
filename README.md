# Château Royal - Site de Location d'Hôtel de Luxe

## 🏰 Description

Site web de location de chambres d'hôtel de luxe avec système de réservation, paiement sécurisé et dashboard administrateur.

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales
- **Page d'accueil** avec vidéo en boucle du hall d'entrée
- **Page Histoire** avec présentation des services (casino, spa, chambres, voiturier)
- **Système d'authentification** avec profils utilisateurs
- **Page Chambres** protégée avec catégories et tarifs modulables
- **Dashboard Admin** avec CRUD complet et statistiques
- **Paiement sécurisé** avec Stripe
- **Page Contact** avec envoi d'emails/SMS
- **Animations 3D** entre les pages

### 🔒 Sécurité
- Protection contre les injections SQL et XSS
- Authentification sécurisée avec Supabase
- Row Level Security (RLS) sur toutes les tables
- Validation et sanitisation des données

### 🎨 Design
- Interface luxueuse avec palette gold/luxury
- Animations fluides avec Framer Motion
- Design responsive adapté à tous les écrans
- Vidéos de haute qualité intégrées

## 🚀 Installation

### Prérequis
- Node.js 18+
- Compte Supabase
- Compte Stripe (optionnel)

### Configuration

1. **Cloner le projet**
```bash
git clone [url-du-repo]
cd chateau-royal
npm install
```

2. **Configuration Supabase**
- Créer un projet sur [Supabase](https://supabase.com)
- Copier `.env.example` vers `.env`
- Remplir les variables d'environnement Supabase

3. **Initialiser la base de données**
- Exécuter le fichier `supabase/migrations/create_hotel_schema.sql` dans l'éditeur SQL de Supabase
- Ou utiliser le fichier `database/schema.sql` pour phpMyAdmin

4. **Démarrer le projet**
```bash
npm run dev
```

## 📊 Base de Données

### Tables Principales
- `profiles` - Profils utilisateurs étendus
- `rooms` - Chambres avec catégories et tarifs
- `room_categories` - Catégories de chambres
- `bookings` - Réservations
- `contact_messages` - Messages de contact

### Compte Admin par Défaut
- **Email**: admin@chateauroyal.com
- **Mot de passe**: admin123

## 🛠 Technologies Utilisées

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Paiements**: Stripe
- **Icons**: Lucide React
- **Build**: Vite

## 📱 Fonctionnalités Détaillées

### Page d'Accueil
- Vidéo en boucle du hall d'entrée
- Navigation transparente qui se fond avec la vidéo
- Sections de services avec animations

### Page Histoire
- Présentation du casino avec vidéos
- Section spa et wellness
- Galerie des chambres
- Service de voiturier

### Système d'Authentification
- Inscription/Connexion sécurisée
- Gestion des profils utilisateurs
- Upload d'images de profil
- Rôles admin/utilisateur

### Page Chambres (Protégée)
- Catégories: 1-4 lits, luxe, suite présidentielle
- Tarifs: soirée, 3 jours, semaine, mois
- Système de réservation
- Intégration Stripe pour les paiements

### Dashboard Admin
- CRUD complet pour les chambres
- Gestion des utilisateurs
- Statistiques en temps réel
- Gestion des réservations

### Page Contact
- Formulaire sécurisé
- Envoi d'emails/SMS
- Informations de contact
- Horaires d'ouverture

## 🔧 Configuration Avancée

### Variables d'Environnement
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Politiques RLS
Les politiques de sécurité sont configurées pour:
- Utilisateurs: accès à leurs propres données
- Admins: accès complet aux données
- Chambres: lecture publique, modification admin uniquement

## 📞 Contact

**Propriétaire**: Arnaud Barotteaux  
**Téléphone**: 06 44 76 27 21  
**Email**: contact@chateauroyal.com

## 📄 Licence

Projet privé - Tous droits réservés