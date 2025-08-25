# 🔧 Configuration Stripe - Royal Hôtel

## 📋 Étapes de configuration

### 1. Créer le fichier d'environnement

1. **Copiez** le contenu du fichier `env-template.txt`
2. **Créez** un nouveau fichier nommé `.env` à la racine du projet
3. **Collez** le contenu et remplacez les valeurs par vos vraies clés

### 2. Obtenir vos clés Stripe

#### 🔑 Clés API Stripe
1. Allez sur [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Connectez-vous à votre compte
3. Naviguez vers **Développeurs** → **Clés API**
4. Copiez :
   - **Clé publique** → `STRIPE_PUBLISHABLE_KEY`
   - **Clé secrète** → `STRIPE_SECRET_KEY`

#### 🪝 Webhook Stripe
1. Dans le dashboard Stripe, allez dans **Développeurs** → **Webhooks**
2. Cliquez sur **+ Ajouter un endpoint**
3. **URL de l'endpoint** : `https://votre-domaine.com/api/webhook`
4. **Événements à écouter** :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Cliquez sur **Ajouter un endpoint**
6. Copiez le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 3. Obtenir vos clés Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Naviguez vers **Settings** → **API**
4. Copiez :
   - **URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configuration du serveur

#### Installation des dépendances serveur
```bash
npm install express stripe cors @supabase/supabase-js dotenv
npm install -D @types/express @types/cors
```

#### Démarrer le serveur
```bash
# Terminal 1 - Serveur backend
cd server
node server.ts

# Terminal 2 - Application React
npm run dev
```

## 🚨 Problèmes actuels à corriger

### 1. Route API incorrecte
- **Frontend** appelle : `/api/create-checkout-session`
- **Backend** expose : `/api/checkout`
- **Solution** : Harmoniser les noms

### 2. Pages de redirection manquantes
- Créer `src/pages/Success.tsx`
- Créer `src/pages/Cancel.tsx`
- Ajouter les routes dans le router

### 3. Configuration Vite
Ajouter dans `vite.config.ts` :
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

## ✅ Vérification

### Test de l'environnement
1. Vérifiez que toutes les variables sont définies
2. Redémarrez les serveurs
3. Testez une réservation

### Variables requises
- ✅ `STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

## 🔒 Sécurité

⚠️ **IMPORTANT** :
- Ne jamais committer le fichier `.env`
- Utiliser des clés de test en développement
- Passer aux clés de production uniquement en production
- Vérifier que `.env` est dans `.gitignore` ✅

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur
2. Testez avec les clés de test Stripe
3. Vérifiez la connectivité Supabase
