# 🗄️ Guide d'Importation Base de Données - Château Royal

## 📋 Étapes d'Importation dans phpMyAdmin

### 1. 🌐 Accéder à phpMyAdmin
- Ouvrir : `http://localhost/phpmyadmin`
- Se connecter avec : **root** (sans mot de passe)

### 2. 🗃️ Créer la Base de Données
1. Cliquer sur **"Nouvelle base de données"**
2. Nom : `chateau_royal`
3. Interclassement : `utf8mb4_unicode_ci`
4. Cliquer **"Créer"**

### 3. 📥 Importer le Schéma
1. **Sélectionner** la base `chateau_royal`
2. Cliquer sur l'onglet **"Importer"**
3. **Choisir le fichier** : `supabase/migrations/20250628214011_gentle_cottage.sql`
4. **Format** : SQL
5. Cliquer **"Exécuter"**

### 4. ✅ Vérification
Après l'import, vous devriez voir :
- ✅ **7 tables** créées
- ✅ **4 chambres** d'exemple
- ✅ **1 utilisateur admin**
- ✅ **Données de test**

### 5. 🔑 Compte Admin Créé
- **Email** : `admin@chateauroyal.com`
- **Mot de passe** : `admin123`
- **Rôle** : Administrateur

## 📊 Tables Créées

| Table | Description | Données |
|-------|-------------|---------|
| `users` | Authentification | 1 admin |
| `profiles` | Profils utilisateurs | 1 profil |
| `room_categories` | Catégories chambres | 4 catégories |
| `rooms` | Chambres du château | 4 chambres |
| `bookings` | Réservations | 2 exemples |
| `contact_messages` | Messages contact | 2 exemples |
| `payments` | Paiements Stripe | Vide |

## 🎯 Données d'Exemple Incluses

### 🏨 **Chambres :**
1. **Suite Royale Versailles** - 1200€/nuit
2. **Chambre Noble Loire** - 450€/nuit  
3. **Chambre Familiale Château** - 320€/nuit
4. **Chambre Standard Élégance** - 180€/nuit

### 👤 **Utilisateur Admin :**
- Arnaud Barotteaux
- Téléphone : 06 44 76 27 21
- Accès complet au dashboard

### 📧 **Messages de Contact :**
- 2 messages d'exemple pour tester l'interface admin

## 🚨 Problèmes Courants

### ❌ **Erreur d'import :**
```
Solution : Vérifier que la base 'chateau_royal' est sélectionnée
```

### ❌ **Erreur UUID() :**
```
Solution : Utiliser MySQL 8.0+ ou MariaDB 10.7+
Si version antérieure, remplacer UUID() par CONCAT(...)
```

### ❌ **Erreur JSON :**
```
Solution : Utiliser MySQL 5.7+ ou MariaDB 10.2+
```

## ✅ Test de Fonctionnement

Après l'import, tester :
1. **Connexion admin** : `admin@chateauroyal.com` / `admin123`
2. **Page chambres** : Voir les 4 chambres
3. **Dashboard admin** : Statistiques et gestion
4. **Réservations** : Système de booking

## 📞 Support

Si problème d'import :
1. Vérifier la version MySQL/MariaDB
2. S'assurer que la base est vide avant import
3. Vérifier les permissions utilisateur root