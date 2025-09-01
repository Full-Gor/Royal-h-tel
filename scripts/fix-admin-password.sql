-- 🔧 Script de création d'utilisateur admin avec mot de passe fort
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- CRÉATION DE L'UTILISATEUR ADMIN
-- =====================================================

-- 1. Créer l'utilisateur dans auth.users
INSERT INTO
    auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES (
        gen_random_uuid (),
        'admin@chateauroyal.com',
        crypt (
            'Admin123!@#',
            gen_salt ('bf')
        ),
        now(),
        now(),
        now(),
        '',
        '',
        '',
        ''
    ) ON CONFLICT (email) DO NOTHING;

-- 2. Récupérer l'ID de l'utilisateur créé
DO $$
DECLARE
    user_id uuid;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = 'admin@chateauroyal.com';
    
    -- 3. Créer le profil admin
    INSERT INTO profiles (
        id,
        first_name,
        last_name,
        phone,
        is_admin,
        profile_image,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        'Arnaud',
        'Barotteaux',
        '0644762721',
        TRUE,
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        is_admin = TRUE,
        profile_image = EXCLUDED.profile_image,
        updated_at = now();
END $$;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que l'utilisateur admin existe
SELECT u.id, u.email, u.created_at, p.first_name, p.last_name, p.is_admin, p.phone
FROM auth.users u
    JOIN profiles p ON u.id = p.id
WHERE
    u.email = 'admin@chateauroyal.com';

-- =====================================================
-- INFORMATIONS DE CONNEXION
-- =====================================================

SELECT '✅ Utilisateur admin créé avec succès !' as message;

SELECT '📧 Email: admin@chateauroyal.com' as email;

SELECT '🔑 Mot de passe: Admin123!@#' as password;

SELECT '👤 Nom: Arnaud Barotteaux' as name;

SELECT '📱 Téléphone: 0644762721' as phone;

SELECT '🔐 Rôle: Administrateur' as role;