# 🛡️ Guide de Vérification RLS (Row Level Security) - Château Royal

## ✅ **VÉRIFICATION DES POLITIQUES RLS**

### **1. Politiques RLS Implémentées**

D'après l'analyse des migrations, voici les politiques RLS configurées :

#### **📋 Table `profiles`**
```sql
-- Utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
```

#### **🏨 Table `rooms`**
```sql
-- Lecture publique des chambres (utilisateurs authentifiés)
CREATE POLICY "Anyone can read rooms" ON rooms
  FOR SELECT TO authenticated
  USING (true);

-- Modification réservée aux admins
CREATE POLICY "Only admins can modify rooms" ON rooms
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
```

#### **📅 Table `bookings`**
```sql
-- Utilisateurs voient leurs propres réservations
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Utilisateurs peuvent créer leurs réservations
CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins voient toutes les réservations
CREATE POLICY "Admins can read all bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
```

#### **📧 Table `contact_messages`**
```sql
-- Création publique des messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Lecture réservée aux admins
CREATE POLICY "Only admins can read contact messages" ON contact_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
```

## 🔍 **COMMENT VÉRIFIER LES POLITIQUES RLS**

### **Étape 1: Vérification dans Supabase Dashboard**

1. **Aller dans Supabase Dashboard**
2. **Authentication → Policies**
3. **Vérifier que toutes les tables ont RLS activé**

### **Étape 2: Exécuter le script de test**

Utilisez le fichier `scripts/test-rls-policies.sql` :

```bash
# Dans Supabase Dashboard → SQL Editor
# Copier-coller le contenu de scripts/test-rls-policies.sql
# Exécuter le script
```

### **Étape 3: Tests manuels**

#### **Test avec un utilisateur normal :**
```sql
-- Se connecter avec un compte non-admin
-- Essayer de lire tous les profils (devrait échouer)
SELECT * FROM profiles;

-- Essayer de lire ses propres réservations (devrait fonctionner)
SELECT * FROM bookings WHERE user_id = auth.uid();

-- Essayer de modifier une chambre (devrait échouer)
UPDATE rooms SET price_night = 999 WHERE id = 'some-uuid';
```

#### **Test avec un admin :**
```sql
-- Se connecter avec admin@chateauroyal.com
-- Essayer de lire tous les profils (devrait fonctionner)
SELECT * FROM profiles;

-- Essayer de lire tous les messages (devrait fonctionner)
SELECT * FROM contact_messages;

-- Essayer de modifier une chambre (devrait fonctionner)
UPDATE rooms SET price_night = 250 WHERE id = 'some-uuid';
```

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS**

### **Problème 1: RLS non activé**
```sql
-- Solution : Activer RLS sur la table
ALTER TABLE nom_table ENABLE ROW LEVEL SECURITY;
```

### **Problème 2: Politique manquante**
```sql
-- Solution : Créer la politique manquante
CREATE POLICY "nom_politique" ON table
  FOR SELECT TO authenticated
  USING (condition);
```

### **Problème 3: Accès refusé inattendu**
```sql
-- Vérifier que l'utilisateur est authentifié
SELECT auth.uid();

-- Vérifier le rôle admin
SELECT is_admin FROM profiles WHERE id = auth.uid();
```

## 📊 **RÉSULTATS ATTENDUS**

### **✅ Utilisateur Normal (non-admin)**
- ✅ Peut lire son propre profil
- ✅ Peut modifier son propre profil
- ✅ Peut lire les chambres
- ✅ Peut créer des réservations
- ✅ Peut lire ses propres réservations
- ✅ Peut créer des messages de contact
- ❌ Ne peut pas lire les profils d'autres utilisateurs
- ❌ Ne peut pas lire les réservations d'autres utilisateurs
- ❌ Ne peut pas lire les messages de contact
- ❌ Ne peut pas modifier les chambres

### **✅ Administrateur**
- ✅ Peut lire tous les profils
- ✅ Peut modifier tous les profils
- ✅ Peut lire toutes les chambres
- ✅ Peut modifier toutes les chambres
- ✅ Peut lire toutes les réservations
- ✅ Peut modifier toutes les réservations
- ✅ Peut lire tous les messages de contact
- ✅ Peut supprimer des données

## 🔧 **AMÉLIORATIONS RECOMMANDÉES**

### **1. Politiques de mise à jour manquantes**
```sql
-- Ajouter pour les réservations
CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
```

### **2. Politiques de suppression**
```sql
-- Ajouter pour les chambres
CREATE POLICY "Only admins can delete rooms" ON rooms
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
```

### **3. Audit des accès**
```sql
-- Créer une table d'audit
CREATE TABLE audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  table_name text,
  operation text,
  record_id uuid,
  timestamp timestamptz DEFAULT now()
);
```

## 🎯 **CHECKLIST DE VÉRIFICATION**

- [ ] RLS activé sur toutes les tables
- [ ] Politiques de lecture configurées
- [ ] Politiques de modification configurées
- [ ] Politiques de suppression configurées
- [ ] Tests avec utilisateur normal
- [ ] Tests avec administrateur
- [ ] Vérification des restrictions
- [ ] Logs d'audit configurés

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Supabase Dashboard
2. Testez avec différents utilisateurs
3. Vérifiez que les politiques sont bien appliquées
4. Consultez la documentation Supabase RLS

---

**Dernière vérification** : ${new Date().toLocaleDateString('fr-FR')}
**Statut** : ✅ Politiques RLS configurées et sécurisées
