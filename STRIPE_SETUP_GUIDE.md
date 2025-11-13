# 💳 Guide d'Activation Stripe - Château Royal

## 📋 Qu'est-ce que Stripe ?

Stripe est une plateforme de paiement en ligne qui permet d'accepter les paiements par carte bancaire de manière sécurisée. Votre projet est **déjà entièrement configuré** pour utiliser Stripe, il ne manque que vos clés API !

## ✅ État Actuel du Projet

### Ce qui est DÉJÀ fait :
- ✅ Packages Stripe installés (`@stripe/stripe-js` + `stripe`)
- ✅ Script Stripe chargé dans le HTML
- ✅ API serverless créées (`create-checkout.js`, `verify-payment.js`)
- ✅ Intégration frontend complète dans la page Chambres
- ✅ Sécurité configurée (validation, CSP, expiration de session)
- ✅ Gestion des succès/échecs de paiement
- ✅ Mise à jour automatique des réservations après paiement

### Ce qui manque :
- ❌ Fichier `.env` avec vos clés API Stripe
- ❌ Compte Stripe (gratuit)

---

## 🚀 Activation en 5 Étapes

### **Étape 1 : Créer un Compte Stripe (5 minutes)**

1. Allez sur https://stripe.com
2. Cliquez sur **"Commencer maintenant"**
3. Remplissez le formulaire d'inscription :
   - Email professionnel
   - Mot de passe sécurisé
   - Nom de votre entreprise : **Château Royal**
4. Validez votre email
5. Complétez votre profil entreprise

**💡 Note** : Le compte est gratuit et vous pouvez tester sans carte bancaire !

---

### **Étape 2 : Récupérer vos Clés API (2 minutes)**

1. Connectez-vous à votre **Dashboard Stripe**
2. Dans le menu de gauche, cliquez sur **"Développeurs"**
3. Cliquez sur **"Clés API"**
4. Vous verrez deux clés de TEST :

   **📌 Clé Publique (Publishable key)** :
   - Commence par `pk_test_...`
   - Exemple : `pk_test_51Abc123XYZ...`
   - Cette clé est publique (peut être vue par les utilisateurs)

   **🔒 Clé Secrète (Secret key)** :
   - Commence par `sk_test_...`
   - Exemple : `sk_test_51Abc123XYZ...`
   - ⚠️ **GARDEZ-LA SECRÈTE !** Ne la partagez jamais !

5. Cliquez sur **"Révéler la clé de test"** pour la copier

---

### **Étape 3 : Créer le Fichier `.env` (1 minute)**

1. Dans le dossier racine du projet `/home/user/Royal-h-tel/`, créez un fichier nommé `.env`

2. Copiez-collez ce contenu et remplacez par vos vraies clés :

```env
# SUPABASE (Si vous utilisez Supabase)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_supabase

# STRIPE - Remplacez par vos vraies clés !
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici

# MODE
NODE_ENV=development
```

3. **Remplacez** :
   - `pk_test_votre_cle_publique_ici` → Votre vraie clé publique
   - `sk_test_votre_cle_secrete_ici` → Votre vraie clé secrète

4. **Sauvegardez** le fichier

---

### **Étape 4 : Vérifier que `.env` est ignoré par Git (Sécurité)**

Le fichier `.env` contient des informations sensibles et **ne doit JAMAIS être commité dans Git**.

Vérifiez que `.gitignore` contient bien :
```
.env
.env.local
.env.*.local
```

✅ C'est déjà fait dans votre projet !

---

### **Étape 5 : Tester les Paiements (5 minutes)**

1. **Lancez l'application** :
   ```bash
   npm run dev
   ```

2. **Connectez-vous** avec un compte (user / user123 ou nazari / nazari123)

3. **Allez sur la page Chambres**

4. **Cliquez sur "Réserver"** pour une chambre

5. **Remplissez le formulaire** et cliquez sur "Procéder au paiement"

6. **Vous serez redirigé vers Stripe Checkout**

7. **Utilisez une carte de test Stripe** :

   | Numéro de carte | 4242 4242 4242 4242 |
   |-----------------|---------------------|
   | **Date d'expiration** | N'importe quelle date future (ex: 12/25) |
   | **CVC** | N'importe quel code 3 chiffres (ex: 123) |
   | **Nom** | N'importe quel nom |

8. **Validez le paiement**

9. **Vous serez redirigé vers la page de succès** 🎉

---

## 🧪 Cartes de Test Stripe

Stripe fournit plusieurs cartes de test pour simuler différents scénarios :

| Scénario | Numéro de carte |
|----------|-----------------|
| ✅ **Paiement réussi** | `4242 4242 4242 4242` |
| ❌ **Carte refusée** | `4000 0000 0000 0002` |
| ⚠️ **Fonds insuffisants** | `4000 0000 0000 9995` |
| 🔒 **Nécessite 3D Secure** | `4000 0027 6000 3184` |

**Date / CVC** : N'importe quelle date future et CVC pour toutes les cartes

Plus de cartes de test : https://stripe.com/docs/testing

---

## 🌍 Déploiement sur Vercel (Optionnel)

Si vous déployez votre site sur **Vercel**, ajoutez les variables d'environnement :

1. Allez dans votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez :
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
   - `STRIPE_SECRET_KEY` = `sk_test_...`
   - `VITE_SUPABASE_URL` = Votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = Votre clé anon Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = Votre clé service Supabase

4. **Redéployez** votre application

---

## 🔄 Passer en Mode Production

Quand vous êtes prêt à accepter de vrais paiements :

1. Dans le Dashboard Stripe, **activez votre compte** :
   - Fournissez les informations légales de votre entreprise
   - Ajoutez vos coordonnées bancaires (pour recevoir les paiements)
   - Vérifiez votre identité

2. **Récupérez vos clés LIVE** :
   - Clé publique : `pk_live_...`
   - Clé secrète : `sk_live_...`

3. **Mettez à jour votre `.env`** :
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_live
   STRIPE_SECRET_KEY=sk_live_votre_cle_live
   NODE_ENV=production
   ```

4. **Redéployez** votre application

⚠️ **Attention** : En mode LIVE, les paiements sont RÉELS et prélevés !

---

## 💰 Tarification Stripe

- **Pas de frais mensuels** : Stripe ne facture que les transactions réussies
- **2,9% + 0,25€** par transaction réussie en Europe
- **Pas de frais d'installation** ni de frais cachés
- **Paiements européens** optimisés avec tarifs réduits

Plus d'infos : https://stripe.com/fr/pricing

---

## 🔧 Dépannage

### ❌ Erreur : "Clé Stripe manquante"

**Cause** : Le fichier `.env` n'existe pas ou la variable n'est pas définie

**Solution** :
1. Vérifiez que le fichier `.env` existe à la racine
2. Vérifiez que `VITE_STRIPE_PUBLISHABLE_KEY` est bien défini
3. Redémarrez le serveur : `npm run dev`

---

### ❌ Erreur : "Stripe is not defined"

**Cause** : Le script Stripe n'est pas chargé

**Solution** : Vérifiez que `index.html` contient :
```html
<script src="https://js.stripe.com/v3/"></script>
```
✅ C'est déjà fait dans votre projet !

---

### ❌ Le paiement ne se lance pas

**Cause** : API serverless non déployée

**Solution** :
- En local : Vérifiez que les fichiers `/api/*.js` existent
- En production : Déployez sur Vercel (qui supporte les API serverless)

---

### ❌ Erreur 500 lors du paiement

**Causes possibles** :
1. Clé secrète invalide dans `.env`
2. API Stripe non accessible
3. Montant invalide (négatif ou trop élevé)

**Solution** :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs serveur
3. Vérifiez que `STRIPE_SECRET_KEY` commence bien par `sk_test_` ou `sk_live_`

---

## 📚 Ressources Utiles

- 📖 **Documentation Stripe** : https://stripe.com/docs
- 🎓 **Tutoriels vidéo** : https://www.youtube.com/stripe
- 💬 **Support Stripe** : support@stripe.com
- 🧪 **Cartes de test** : https://stripe.com/docs/testing
- 🔐 **Sécurité Stripe** : https://stripe.com/docs/security

---

## ✅ Checklist Finale

Avant de déployer en production, vérifiez :

- [ ] Compte Stripe créé et activé
- [ ] Clés API récupérées (LIVE pour production)
- [ ] Fichier `.env` créé avec les bonnes clés
- [ ] `.env` bien ignoré par Git (sécurité)
- [ ] Paiements testés en mode TEST
- [ ] Coordonnées bancaires ajoutées à Stripe (pour recevoir les paiements)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Application redéployée avec les clés LIVE

---

## 🎉 Félicitations !

Votre système de paiement Stripe est maintenant opérationnel !

Vos clients peuvent réserver et payer en toute sécurité directement sur votre site.

**Prochaines étapes** :
1. ✅ Testez plusieurs scénarios de paiement
2. ✅ Configurez les emails de confirmation Stripe
3. ✅ Activez les webhooks pour la synchronisation temps réel
4. ✅ Passez en mode LIVE quand vous êtes prêt

---

**Besoin d'aide ?** Consultez la documentation ou contactez le support Stripe !
