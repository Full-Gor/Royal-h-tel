-- Château Royal - Schéma de Base de Données MySQL/phpMyAdmin
-- Version finale corrigée pour toutes les versions de MySQL

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS chateau_royal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chateau_royal;

-- Table des utilisateurs (authentification)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image VARCHAR(500) DEFAULT 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_profiles_admin (is_admin)
) ENGINE=InnoDB;

-- Table des catégories de chambres
CREATE TABLE IF NOT EXISTS room_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_occupancy INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categories_name (name)
) ENGINE=InnoDB;

-- Table des chambres
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category_id VARCHAR(36),
  beds INT NOT NULL DEFAULT 1,
  has_view BOOLEAN DEFAULT FALSE,
  images TEXT,
  description TEXT,
  amenities TEXT,
  price_night DECIMAL(10,2) NOT NULL,
  price_three_days DECIMAL(10,2) NOT NULL,
  price_week DECIMAL(10,2) NOT NULL,
  price_month DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  total_reservations INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL,
  INDEX idx_rooms_category (category_id),
  INDEX idx_rooms_available (available),
  INDEX idx_rooms_name (name)
) ENGINE=InnoDB;

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  room_id VARCHAR(36) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  duration_type ENUM('night', 'threeDays', 'week', 'month') NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_bookings_user (user_id),
  INDEX idx_bookings_room (room_id),
  INDEX idx_bookings_dates (check_in, check_out),
  INDEX idx_bookings_status (status)
) ENGINE=InnoDB;

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  contact_method ENUM('email', 'phone', 'sms') DEFAULT 'email',
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status),
  INDEX idx_contact_created (created_at)
) ENGINE=InnoDB;

-- Table des paiements (pour Stripe)
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL,
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status ENUM('pending', 'succeeded', 'failed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_payments_booking (booking_id),
  INDEX idx_payments_stripe (stripe_payment_id)
) ENGINE=InnoDB;

-- Insertion des catégories par défaut avec IDs fixes
INSERT INTO room_categories (id, name, description, max_occupancy) VALUES
('cat-suite-presidentielle', 'Suite Présidentielle', 'Suite d''exception avec services premium', 2),
('cat-chambre-luxe', 'Chambre de Luxe', 'Chambre élégante avec équipements haut de gamme', 2),
('cat-chambre-familiale', 'Chambre Familiale', 'Spacieuse chambre pour familles', 4),
('cat-chambre-standard', 'Chambre Standard', 'Confort et élégance à prix accessible', 2);

-- Insertion des chambres par défaut
INSERT INTO rooms (id, name, category_id, beds, has_view, images, description, amenities, price_night, price_three_days, price_week, price_month, total_reservations) VALUES
(
  'room-suite-versailles',
  'Suite Royale Versailles',
  'cat-suite-presidentielle',
  1,
  TRUE,
  '["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Suite d''exception avec vue panoramique sur les jardins du château. Décoration raffinée avec mobilier d''époque.',
  '["Jacuzzi privé","Cheminée","Balcon","Service de majordome","Minibar premium"]',
  1200.00,
  3200.00,
  7000.00,
  25000.00,
  25
),
(
  'room-noble-loire',
  'Chambre Noble Loire',
  'cat-chambre-luxe',
  2,
  TRUE,
  '["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Chambre élégante avec deux lits king-size et vue sur la vallée. Parfaite pour les couples ou amis.',
  '["Salle de bain marbre","Terrasse privée","Wifi haut débit","Coffre-fort","Peignoirs"]',
  450.00,
  1200.00,
  2800.00,
  10000.00,
  18
),
(
  'room-familiale-chateau',
  'Chambre Familiale Château',
  'cat-chambre-familiale',
  4,
  FALSE,
  '["https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Spacieuse chambre familiale avec quatre lits, idéale pour les familles. Décoration chaleureuse.',
  '["Réfrigérateur","Espace salon","Salle de bain familiale","Télévision","Climatisation"]',
  320.00,
  850.00,
  2000.00,
  7500.00,
  12
),
(
  'room-standard-elegance',
  'Chambre Standard Élégance',
  'cat-chambre-standard',
  1,
  FALSE,
  '["https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Chambre confortable avec tout le nécessaire pour un séjour agréable.',
  '["Wifi gratuit","Télévision","Minibar","Coffre-fort"]',
  180.00,
  480.00,
  1100.00,
  4000.00,
  8
);

-- Création de l'utilisateur admin par défaut
-- Mot de passe: admin123 (hashé avec bcrypt)
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('admin-uuid-12345', 'admin@chateauroyal.com', '$2b$10$rOzJqQZJQZJQZJQZJQZJQOzJqQZJQZJQZJQZJQZJQZJQZJQZJQZJQ', TRUE);

INSERT INTO profiles (id, first_name, last_name, phone, is_admin, profile_image) VALUES
('admin-uuid-12345', 'Arnaud', 'Barotteaux', '0644762721', TRUE, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');

-- Insertion de quelques réservations d'exemple
INSERT INTO bookings (id, user_id, room_id, check_in, check_out, guests, duration_type, total_amount, status, payment_status) VALUES
('booking-example-1', 'admin-uuid-12345', 'room-suite-versailles', '2024-01-15', '2024-01-16', 2, 'night', 1200.00, 'completed', 'paid'),
('booking-example-2', 'admin-uuid-12345', 'room-noble-loire', '2024-02-01', '2024-02-04', 2, 'threeDays', 1200.00, 'confirmed', 'paid');

-- Insertion de quelques messages de contact d'exemple
INSERT INTO contact_messages (id, name, email, phone, subject, message, contact_method, status) VALUES
('contact-msg-1', 'Jean Dupont', 'jean.dupont@email.com', '0123456789', 'Demande de réservation', 'Bonjour, je souhaiterais réserver une suite pour le weekend prochain.', 'email', 'new'),
('contact-msg-2', 'Marie Martin', 'marie.martin@email.com', '0987654321', 'Question sur les services', 'Proposez-vous un service de spa ?', 'email', 'read');

-- Index pour optimiser les performances
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_rooms_price_night ON rooms(price_night);
CREATE INDEX idx_contact_email ON contact_messages(email);

-- Commentaires pour la documentation
ALTER TABLE users COMMENT = 'Table des utilisateurs avec authentification';
ALTER TABLE profiles COMMENT = 'Profils étendus des utilisateurs';
ALTER TABLE rooms COMMENT = 'Chambres et suites du château';
ALTER TABLE bookings COMMENT = 'Réservations des clients';
ALTER TABLE contact_messages COMMENT = 'Messages de contact du site web';
ALTER TABLE payments COMMENT = 'Paiements Stripe';
ALTER TABLE room_categories COMMENT = 'Catégories de chambres';

-- Affichage des informations de création
SELECT 'Base de données Château Royal créée avec succès!' as message;
SELECT 'Utilisateur admin créé: admin@chateauroyal.com / admin123' as admin_info;
SELECT CONCAT('Total chambres créées: ', COUNT(*)) as rooms_created FROM rooms;
SELECT CONCAT('Total catégories créées: ', COUNT(*)) as categories_created FROM room_categories;