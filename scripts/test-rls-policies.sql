-- Script de test des politiques RLS - Château Royal
-- À exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- TEST 1: Vérification que RLS est activé
-- =====================================================

SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE
    schemaname = 'public'
    AND tablename IN (
        'profiles',
        'rooms',
        'bookings',
        'contact_messages',
        'room_categories',
        'menu_categories',
        'menu_items',
        'legal_pages'
    );

-- =====================================================
-- TEST 2: Vérification des politiques existantes
-- =====================================================

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE
    schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- TEST 3: Simulation d'accès utilisateur normal
-- =====================================================

-- Simuler un utilisateur normal (non-admin)
-- Note: Ces tests doivent être exécutés avec un utilisateur authentifié

-- Test lecture de son propre profil
-- SELECT * FROM profiles WHERE id = auth.uid();

-- Test lecture des chambres (devrait fonctionner)
-- SELECT * FROM rooms LIMIT 5;

-- Test lecture de ses propres réservations
-- SELECT * FROM bookings WHERE user_id = auth.uid();

-- Test création d'une réservation
-- INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, duration_type, total_amount)
-- VALUES (auth.uid(), 'room-uuid', '2024-12-25', '2024-12-26', 2, 'night', 200.00);

-- =====================================================
-- TEST 4: Simulation d'accès admin
-- =====================================================

-- Ces tests nécessitent un utilisateur avec is_admin = true

-- Test lecture de tous les profils (admin uniquement)
-- SELECT * FROM profiles;

-- Test lecture de toutes les réservations (admin uniquement)
-- SELECT * FROM bookings;

-- Test lecture des messages de contact (admin uniquement)
-- SELECT * FROM contact_messages;

-- Test modification des chambres (admin uniquement)
-- UPDATE rooms SET price_night = 250.00 WHERE id = 'room-uuid';

-- =====================================================
-- TEST 5: Vérification des restrictions
-- =====================================================

-- Un utilisateur normal ne devrait PAS pouvoir :
-- 1. Lire les profils d'autres utilisateurs
-- 2. Lire les réservations d'autres utilisateurs
-- 3. Lire les messages de contact
-- 4. Modifier les chambres
-- 5. Supprimer des données

-- =====================================================
-- TEST 6: Vérification des triggers et fonctions
-- =====================================================

-- Vérifier que le trigger de création de profil existe
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE
    trigger_name = 'on_auth_user_created';

-- Vérifier que la fonction handle_new_user existe
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE
    routine_name = 'handle_new_user';

-- =====================================================
-- RÉSULTATS ATTENDUS
-- =====================================================

/*
Résultats attendus pour un site sécurisé :

1. Toutes les tables doivent avoir rowsecurity = true
2. Chaque table doit avoir au moins une politique RLS
3. Les politiques doivent être restrictives :
- Utilisateurs : accès uniquement à leurs données
- Admins : accès complet
- Messages de contact : création publique, lecture admin uniquement
4. Le trigger on_auth_user_created doit exister
5. La fonction handle_new_user doit exister avec SECURITY DEFINER
*/

-- =====================================================
-- RECOMMANDATIONS DE SÉCURITÉ
-- =====================================================

/*
Si des problèmes sont détectés :

1. Vérifier que toutes les tables ont RLS activé :
ALTER TABLE nom_table ENABLE ROW LEVEL SECURITY;

2. Créer des politiques manquantes selon le modèle :
CREATE POLICY "nom_politique" ON table
FOR operation TO authenticated
USING (condition);

3. Tester avec différents utilisateurs (normal vs admin)

4. Vérifier les logs d'accès dans Supabase Dashboard
*/