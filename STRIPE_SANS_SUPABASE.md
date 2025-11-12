# 💳 Stripe SANS Supabase - Mode Démo

## ✅ Bonne Nouvelle !

**OUI, Stripe fonctionne sans Supabase !** 🎉

Votre projet est maintenant configuré pour fonctionner **100% en mode démo** avec :
- ✅ Authentification localStorage (user / nazari)
- ✅ Chambres en localStorage
- ✅ Menu en localStorage
- ✅ **Réservations en localStorage**
- ✅ **Paiements Stripe fonctionnels !**

---

## 🚀 Comment ça Marche ?

### 1. **Système Intelligent**

Le code détecte automatiquement si vous êtes un utilisateur démo :
- **Utilisateur démo** : ID commence par `demo-` → Utilise **localStorage**
- **Utilisateur réel** : ID normal → Utilise **Supabase** (si configuré)

### 2. **Flow de Paiement en Mode Démo**

```
1. Connexion (user / nazari)
   ↓
2. Choix d'une chambre
   ↓
3. Clic sur "Réserver"
   ↓
4. Réservation créée en localStorage (status: pending)
   ↓
5. Redirection vers Stripe Checkout 💳
   ↓
6. Paiement avec carte de test
   ↓
7. Retour sur /success
   ↓
8. Mise à jour localStorage (status: paid)
   ↓
9. Réservation confirmée ! ✅
```

---

## 🔧 Configuration Rapide

### **Étape 1 : Récupérez vos Clés Stripe**

1. Allez sur https://dashboard.stripe.com/test/apikeys
2. Copiez :
   - **Clé publique** : `pk_test_...`
   - **Clé secrète** : `sk_test_...`

### **Étape 2 : Mettez à jour le fichier `.env`**

Le fichier `.env` existe déjà à la racine. Ouvrez-le et remplacez :

```env
VITE_STRIPE_PUBLISHABLE_KEY=VOTRE_CLE_PUBLIQUE_pk_test_...
STRIPE_SECRET_KEY=VOTRE_CLE_SECRETE_sk_test_...
```

### **Étape 3 : Redémarrez l'application**

```bash
npm run dev
```

C'est tout ! 🎉

---

## 🧪 Tester un Paiement

### 1. Connexion
- Nom d'utilisateur : `user` ou `nazari`
- Mot de passe : `user123` ou `nazari123`

### 2. Réserver une Chambre
- Allez sur **Chambres**
- Cliquez sur **Réserver**
- Remplissez les dates
- Cliquez sur **Procéder au paiement**

### 3. Payer avec Stripe
Vous serez redirigé vers Stripe Checkout.

**Carte de test** :
```
Numéro : 4242 4242 4242 4242
Date   : 12/25 (n'importe quelle date future)
CVC    : 123 (n'importe quel code 3 chiffres)
Nom    : Test User
```

### 4. Confirmation
Après le paiement, vous serez redirigé vers `/success` et la réservation sera confirmée !

### 5. Voir vos Réservations
Allez sur **Mes Réservations** pour voir votre réservation payée.

---

## 📁 Où Sont Stockées les Données ?

### **Mode Démo (sans Supabase)** :
- **Authentification** : `localStorage.demo_user`
- **Réservations** : `localStorage.bookings`
- **Chambres** : `localStorage.rooms`
- **Menu** : `localStorage.menu_items` + `localStorage.menu_categories`

### **Avantages** :
✅ Pas besoin de base de données
✅ Fonctionne hors ligne
✅ Configuration instantanée
✅ Parfait pour tester et développer

### **Inconvénients** :
❌ Données perdues si on vide le cache du navigateur
❌ Données non partagées entre navigateurs
❌ Pas de synchronisation multi-utilisateurs

---

## 🔄 Différences avec Supabase

| Fonctionnalité | Mode Démo (localStorage) | Avec Supabase |
|----------------|-------------------------|---------------|
| Authentification | ✅ Fictive (2 users) | ✅ Réelle (inscription) |
| Chambres | ✅ 6 chambres démo | ✅ Base de données |
| Réservations | ✅ localStorage | ✅ Base de données |
| Paiements Stripe | ✅ **Fonctionnel** | ✅ Fonctionnel |
| Persistance | ❌ Cache navigateur | ✅ Serveur |
| Multi-utilisateurs | ❌ Non | ✅ Oui |

---

## 🎯 Cas d'Usage

### **Mode Démo = Parfait pour :**
- ✅ Développement et tests
- ✅ Démonstrations clients
- ✅ Prototypes rapides
- ✅ Apprendre à utiliser Stripe
- ✅ Tester l'interface utilisateur

### **Avec Supabase = Nécessaire pour :**
- Production avec vrais clients
- Gestion multi-utilisateurs
- Persistance des données
- Partage entre appareils
- Statistiques et analytics

---

## 🔐 Sécurité

### **En Mode Test (clés pk_test_ / sk_test_)**
- ✅ Aucun vrai argent n'est prélevé
- ✅ Seules les cartes de test fonctionnent
- ✅ Parfait pour développer en sécurité

### **En Mode Live (clés pk_live_ / sk_live_)**
- ⚠️ Vrais paiements avec vrai argent
- ⚠️ Nécessite activation du compte Stripe
- ⚠️ Nécessite HTTPS en production

---

## 🚨 Problèmes Courants

### ❌ "Clé Stripe manquante"

**Cause** : Le fichier `.env` n'a pas les bonnes clés

**Solution** :
```bash
# Vérifiez que .env contient :
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle...
STRIPE_SECRET_KEY=sk_test_votre_cle...

# Redémarrez l'app
npm run dev
```

---

### ❌ "Impossible de créer la session Stripe"

**Cause** : Clé secrète incorrecte ou API non accessible

**Solution** :
1. Vérifiez que `STRIPE_SECRET_KEY` est correct dans `.env`
2. Vérifiez que les fichiers `/api/create-checkout.js` existent
3. Si vous êtes sur Vercel, configurez les variables d'environnement

---

### ❌ "Réservation non trouvée après paiement"

**Cause** : localStorage vidé ou booking ID incorrect

**Solution** :
1. Ne videz pas le cache du navigateur pendant le paiement
2. Utilisez le même navigateur pour le retour Stripe
3. Vérifiez la console (F12) pour les erreurs

---

## 📊 Données de Test

### **Comptes Démo** :
```
Utilisateur Standard :
- Username: user
- Password: user123

Administrateur :
- Username: nazari
- Password: nazari123
```

### **Cartes Stripe de Test** :
```
✅ Succès : 4242 4242 4242 4242
❌ Refusée : 4000 0000 0000 0002
💰 Fonds insuffisants : 4000 0000 0000 9995
🔒 3D Secure : 4000 0027 6000 3184
```

---

## 💡 Prochaines Étapes

### **Pour Continuer en Mode Démo** :
1. ✅ Vous êtes déjà prêt !
2. Testez tous les scénarios de paiement
3. Personnalisez l'interface
4. Ajoutez vos propres chambres en localStorage

### **Pour Passer en Production** :
1. Configurez Supabase (voir `SETUP_SUPABASE.md`)
2. Passez aux clés Stripe LIVE (`pk_live_` / `sk_live_`)
3. Déployez sur Vercel ou Netlify
4. Configurez un nom de domaine
5. Activez HTTPS

---

## ✅ Checklist de Vérification

Avant de tester Stripe, vérifiez :

- [ ] Fichier `.env` existe à la racine
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` commence par `pk_test_`
- [ ] `STRIPE_SECRET_KEY` commence par `sk_test_`
- [ ] Application redémarrée (`npm run dev`)
- [ ] Connecté avec `user` ou `nazari`
- [ ] Carte de test prête : `4242 4242 4242 4242`

---

## 🎉 Résumé

**Vous POUVEZ utiliser Stripe sans Supabase !**

Votre projet est configuré pour :
- ✅ Fonctionner 100% en localStorage
- ✅ Accepter des paiements Stripe
- ✅ Gérer les réservations
- ✅ Confirmer les paiements
- ✅ Tout ça sans base de données !

**C'est parfait pour** :
- Développer et tester
- Faire des démos
- Apprendre Stripe
- Prototyper rapidement

**Quand vous serez prêt** pour la production avec vrais clients et persistance, vous pourrez ajouter Supabase facilement (voir `SETUP_SUPABASE.md`).

---

**Besoin d'aide ?**
- Consultez `STRIPE_SETUP_GUIDE.md` pour plus de détails
- Vérifiez la console du navigateur (F12) pour les erreurs
- Testez avec les cartes Stripe de test

Bon développement ! 🚀
