-- Script pour ajouter les colonnes manquantes à la table bookings
-- À exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. AJOUTER LES COLONNES MANQUANTES
-- =====================================================

-- Ajouter la colonne adults
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS adults integer DEFAULT 1;

-- Ajouter la colonne children
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS children integer DEFAULT 0;

-- Ajouter la colonne return_date si elle n'existe pas
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_date date;

-- =====================================================
-- 2. VÉRIFIER LA STRUCTURE DE LA TABLE
-- =====================================================

-- Voir toutes les colonnes de la table bookings
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'bookings'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 3. METTRE À JOUR LES DONNÉES EXISTANTES
-- =====================================================

-- Mettre à jour les réservations existantes avec des valeurs par défaut
UPDATE bookings
SET
    adults = COALESCE(guests, 1),
    children = 0
WHERE
    adults IS NULL
    OR children IS NULL;

-- =====================================================
-- 4. VÉRIFIER LES DONNÉES
-- =====================================================

-- Voir quelques exemples de réservations
SELECT
    id,
    user_id,
    room_id,
    check_in,
    check_out,
    guests,
    adults,
    children,
    total_amount,
    status
FROM bookings
LIMIT 5;