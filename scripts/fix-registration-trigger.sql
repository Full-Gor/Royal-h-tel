-- Script pour corriger le trigger d'inscription - Château Royal
-- À exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. SUPPRIMER L'ANCIEN TRIGGER
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- =====================================================
-- 2. CORRIGER LA FONCTION handle_new_user
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    phone,
    is_admin
  )
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'first_name',
      'Utilisateur'
    ),
    COALESCE(
      new.raw_user_meta_data->>'last_name',
      'Nouveau'
    ),
    COALESCE(
      new.raw_user_meta_data->>'phone',
      NULL
    ),
    CASE 
      WHEN new.email = 'admin@chateauroyal.com' THEN true 
      WHEN new.email = 'admin2@chateauroyal.com' THEN true
      ELSE false 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. RECRÉER LE TRIGGER
-- =====================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================================
-- 4. VÉRIFIER QUE LE TRIGGER FONCTIONNE
-- =====================================================

-- Vérifier que la fonction existe
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE
    routine_name = 'handle_new_user';

-- Vérifier que le trigger existe
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE
    trigger_name = 'on_auth_user_created';

-- =====================================================
-- 5. TESTER AVEC UN UTILISATEUR EXISTANT
-- =====================================================

-- Vérifier les utilisateurs sans profil
SELECT u.id, u.email, u.raw_user_meta_data
FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
WHERE
    p.id IS NULL;

-- =====================================================
-- 6. CRÉER LES PROFILS MANQUANTS
-- =====================================================

-- Pour chaque utilisateur sans profil, créer le profil manuellement
-- (Exécuter cette partie seulement si nécessaire)

-- Créer les profils manquants
INSERT INTO
    profiles (
        id,
        first_name,
        last_name,
        phone,
        is_admin
    )
SELECT
    u.id,
    COALESCE(
        u.raw_user_meta_data ->> 'first_name',
        'Utilisateur'
    ),
    COALESCE(
        u.raw_user_meta_data ->> 'last_name',
        'Nouveau'
    ),
    COALESCE(
        u.raw_user_meta_data ->> 'phone',
        NULL
    ),
    CASE
        WHEN u.email = 'admin@chateauroyal.com' THEN true
        WHEN u.email = 'admin2@chateauroyal.com' THEN true
        ELSE false
    END
FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
WHERE
    p.id IS NULL;