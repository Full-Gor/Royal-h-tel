# 🚀 Configuration Supabase pour Château Royal

## 📋 Étapes de Configuration

### 1. 🌐 Créer un Compte Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur **"Start your project"**
3. Se connecter avec GitHub (recommandé)

### 2. 🗃️ Créer un Nouveau Projet
1. Cliquer sur **"New Project"**
2. **Nom du projet** : `chateau-royal`
3. **Mot de passe** : Choisir un mot de passe fort
4. **Région** : Europe West (Ireland) - `eu-west-1`
5. Cliquer **"Create new project"**

### 3. 📊 Importer le Schéma de Base de Données
1. Dans le dashboard Supabase, aller dans **"SQL Editor"**
2. Cliquer sur **"New query"**
3. Copier-coller le contenu du fichier : `supabase/migrations/20250628151349_velvet_shrine.sql`
4. Cliquer **"Run"** pour exécuter le script

### 4. 🔑 Récupérer les Clés API
1. Aller dans **"Settings"** → **"API"**
2. Copier :
   - **Project URL** : `https://votre-projet-id.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. ⚙️ Configurer les Variables d'Environnement
Modifier le fichier `.env` dans le projet :

```env
# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mode Supabase
VITE_SITE_MODE=supabase
```

### 6. 🎯 Créer un Utilisateur Admin (DANS SUPABASE)
1. Dans Supabase, aller dans **"Authentication"** → **"Users"**
2. Cliquer **"Add user"**
3. **Email** : `admin@chateauroyal.com`
4. **Password** : `admin123`
5. **Confirm** : Cocher "Auto Confirm User"
6. Cliquer **"Create user"**

### 7. 🔧 Configurer l'Utilisateur Admin (DANS SUPABASE)
1. Aller dans **"Table Editor"** → **"profiles"**
2. Trouver l'utilisateur créé (admin@chateauroyal.com)
3. Cliquer sur la ligne pour l'éditer
4. Modifier :
   - **first_name** : `Arnaud`
   - **last_name** : `Barotteaux`
   - **phone** : `0644762721`
   - **is_admin** : `true` (cocher la case)
5. Cliquer **"Save"**

## ✅ Vérification

### Test de Connexion :
1. Lancer le site : `npm run dev`
2. Aller sur `/login`
3. Se connecter avec : `admin@chateauroyal.com` / `admin123`
4. Vérifier l'accès aux chambres

### Données Créées :
- ✅ **4 catégories** de chambres
- ✅ **3 chambres** d'exemple avec images
- ✅ **1 utilisateur admin**
- ✅ **Système de réservation** fonctionnel

## 🚀 Déploiement

Une fois Supabase configuré, le site peut être déployé sur :
- **Netlify** (recommandé)
- **Vercel**
- **Railway**

## 🆘 Problèmes Courants

### Erreur "Invalid API key" :
- Vérifier que les clés dans `.env` sont correctes
- Redémarrer le serveur de développement

### Erreur "Table doesn't exist" :
- Vérifier que le script SQL a été exécuté complètement
- Vérifier dans "Table Editor" que les tables existent

### Erreur de connexion utilisateur :
- Vérifier que l'utilisateur admin a été créé
- Vérifier que `is_admin` est bien à `true`

## 📞 Support

Si problème de configuration :
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs Supabase dans le dashboard
3. S'assurer que toutes les étapes ont été suivies

## 🎯 **RÉSUMÉ RAPIDE :**

**Étape 6** : Dans Supabase → Authentication → Users → Add user
**Étape 7** : Dans Supabase → Table Editor → profiles → Éditer l'utilisateur

**Fichier .env** : Remplacer `VOTRE-PROJET-ID` par votre vraie URL !