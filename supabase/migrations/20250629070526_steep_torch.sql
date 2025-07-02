-- Château Royal - Migration Supabase (Version corrigée sans ON CONFLICT)

-- Table des profils utilisateurs (étend auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  profile_image text DEFAULT 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des catégories de chambres
CREATE TABLE IF NOT EXISTS room_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  max_occupancy integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table des chambres
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES room_categories(id),
  beds integer NOT NULL DEFAULT 1,
  has_view boolean DEFAULT false,
  images text[] DEFAULT '{}',
  description text,
  amenities text[] DEFAULT '{}',
  price_night decimal(10,2) NOT NULL,
  price_three_days decimal(10,2) NOT NULL,
  price_week decimal(10,2) NOT NULL,
  price_month decimal(10,2) NOT NULL,
  available boolean DEFAULT true,
  total_reservations integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  room_id uuid REFERENCES rooms(id),
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  duration_type text NOT NULL CHECK (duration_type IN ('night', 'threeDays', 'week', 'month')),
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  contact_method text DEFAULT 'email' CHECK (contact_method IN ('email', 'phone', 'sms')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- Vérifier si les catégories existent déjà, sinon les créer
DO $$
DECLARE
  suite_id uuid;
  luxe_id uuid;
  familiale_id uuid;
  standard_id uuid;
BEGIN
  -- Vérifier et créer les catégories si elles n'existent pas
  SELECT id INTO suite_id FROM room_categories WHERE name = 'Suite Présidentielle' LIMIT 1;
  IF suite_id IS NULL THEN
    INSERT INTO room_categories (name, description, max_occupancy) 
    VALUES ('Suite Présidentielle', 'Suite d''exception avec services premium', 2)
    RETURNING id INTO suite_id;
  END IF;

  SELECT id INTO luxe_id FROM room_categories WHERE name = 'Chambre de Luxe' LIMIT 1;
  IF luxe_id IS NULL THEN
    INSERT INTO room_categories (name, description, max_occupancy) 
    VALUES ('Chambre de Luxe', 'Chambre élégante avec équipements haut de gamme', 2)
    RETURNING id INTO luxe_id;
  END IF;

  SELECT id INTO familiale_id FROM room_categories WHERE name = 'Chambre Familiale' LIMIT 1;
  IF familiale_id IS NULL THEN
    INSERT INTO room_categories (name, description, max_occupancy) 
    VALUES ('Chambre Familiale', 'Spacieuse chambre pour familles', 4)
    RETURNING id INTO familiale_id;
  END IF;

  SELECT id INTO standard_id FROM room_categories WHERE name = 'Chambre Standard' LIMIT 1;
  IF standard_id IS NULL THEN
    INSERT INTO room_categories (name, description, max_occupancy) 
    VALUES ('Chambre Standard', 'Confort et élégance à prix accessible', 2)
    RETURNING id INTO standard_id;
  END IF;

  -- Vérifier et créer les chambres si elles n'existent pas
  IF NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Suite Royale Versailles') THEN
    INSERT INTO rooms (name, category_id, beds, has_view, images, description, amenities, price_night, price_three_days, price_week, price_month, total_reservations) 
    VALUES (
      'Suite Royale Versailles',
      suite_id,
      1,
      true,
      ARRAY[
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'Suite d''exception avec vue panoramique sur les jardins du château. Décoration raffinée avec mobilier d''époque.',
      ARRAY['Jacuzzi privé', 'Cheminée', 'Balcon', 'Service de majordome', 'Minibar premium'],
      1200.00,
      3200.00,
      7000.00,
      25000.00,
      25
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Chambre Noble Loire') THEN
    INSERT INTO rooms (name, category_id, beds, has_view, images, description, amenities, price_night, price_three_days, price_week, price_month, total_reservations) 
    VALUES (
      'Chambre Noble Loire',
      luxe_id,
      2,
      true,
      ARRAY[
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'Chambre élégante avec deux lits king-size et vue sur la vallée. Parfaite pour les couples ou amis.',
      ARRAY['Salle de bain marbre', 'Terrasse privée', 'Wifi haut débit', 'Coffre-fort', 'Peignoirs'],
      450.00,
      1200.00,
      2800.00,
      10000.00,
      18
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Chambre Familiale Château') THEN
    INSERT INTO rooms (name, category_id, beds, has_view, images, description, amenities, price_night, price_three_days, price_week, price_month, total_reservations) 
    VALUES (
      'Chambre Familiale Château',
      familiale_id,
      4,
      false,
      ARRAY[
        'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'Spacieuse chambre familiale avec quatre lits, idéale pour les familles. Décoration chaleureuse.',
      ARRAY['Réfrigérateur', 'Espace salon', 'Salle de bain familiale', 'Télévision', 'Climatisation'],
      320.00,
      850.00,
      2000.00,
      7500.00,
      12
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Chambre Standard Élégance') THEN
    INSERT INTO rooms (name, category_id, beds, has_view, images, description, amenities, price_night, price_three_days, price_week, price_month, total_reservations) 
    VALUES (
      'Chambre Standard Élégance',
      standard_id,
      1,
      false,
      ARRAY[
        'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'Chambre confortable avec tout le nécessaire pour un séjour agréable.',
      ARRAY['Wifi gratuit', 'Télévision', 'Minibar', 'Coffre-fort'],
      180.00,
      480.00,
      1100.00,
      4000.00,
      8
    );
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les profils
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politiques RLS pour les chambres
DROP POLICY IF EXISTS "Anyone can read rooms" ON rooms;
CREATE POLICY "Anyone can read rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques RLS pour les catégories
DROP POLICY IF EXISTS "Anyone can read categories" ON room_categories;
CREATE POLICY "Anyone can read categories"
  ON room_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques RLS pour les réservations
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Politiques RLS pour les messages de contact
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fonction pour créer un profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, is_admin)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'Utilisateur'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'Nouveau'),
    CASE WHEN new.email = 'admin@chateauroyal.com' THEN true ELSE false END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_rooms_category ON rooms(category_id);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(available);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);

-- Message de confirmation
SELECT 'Base de données Château Royal créée avec succès!' as message;
SELECT 'Utilisateur admin sera créé automatiquement lors de l''inscription' as admin_info;
SELECT COUNT(*) || ' chambres créées' as rooms_created FROM rooms;
SELECT COUNT(*) || ' catégories créées' as categories_created FROM room_categories;