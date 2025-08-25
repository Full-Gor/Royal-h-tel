/*
  # Château Royal - Base de Données Complète pour phpMyAdmin
  
  Ce fichier SQL est conçu pour être importé directement dans phpMyAdmin
  Il contient toutes les tables, données et configurations nécessaires
  pour faire fonctionner le site Château Royal
  
  Instructions d'installation :
  1. Ouvrir phpMyAdmin
  2. Créer une nouvelle base de données "chateau_royal"
  3. Importer ce fichier SQL
  4. Configurer les variables d'environnement dans .env
*/

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS chateau_royal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chateau_royal;

-- =====================================================
-- SUPPRESSION DES TABLES EXISTANTES (si elles existent)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room_categories;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des utilisateurs (authentification)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des profils utilisateurs (informations étendues)
CREATE TABLE profiles (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image TEXT DEFAULT 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_profiles_admin (is_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des catégories de chambres
CREATE TABLE room_categories (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_occupancy INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des chambres
CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(200) NOT NULL,
  category_id VARCHAR(36),
  beds INT NOT NULL DEFAULT 1,
  has_view BOOLEAN DEFAULT FALSE,
  images JSON,
  description TEXT,
  amenities JSON,
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
  INDEX idx_rooms_price (price_night)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réservations
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  room_id VARCHAR(36),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des paiements
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  booking_id VARCHAR(36),
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status ENUM('pending', 'succeeded', 'failed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_payments_booking (booking_id),
  INDEX idx_payments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des messages de contact
CREATE TABLE contact_messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  contact_method ENUM('email', 'phone', 'sms') DEFAULT 'email',
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status),
  INDEX idx_contact_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTION DES DONNÉES
-- =====================================================

-- Insertion des catégories de chambres
INSERT INTO room_categories (id, name, description, max_occupancy) VALUES
('cat-1', 'Suite Présidentielle', 'Suite d''exception avec services premium et vue panoramique', 2),
('cat-2', 'Chambre de Luxe', 'Chambre élégante avec équipements haut de gamme', 2),
('cat-3', 'Chambre Familiale', 'Spacieuse chambre pour familles avec équipements adaptés', 6),
('cat-4', 'Chambre Standard Plus', 'Confort supérieur et élégance à prix accessible', 2),
('cat-5', 'Suite Junior', 'Suite compacte avec salon séparé', 2),
('cat-6', 'Chambre Romantique', 'Ambiance intime avec jacuzzi privatif', 2),
('cat-7', 'Penthouse Royal', 'Appartement de luxe avec terrasse panoramique', 4),
('cat-8', 'Chambre Business', 'Équipée pour les voyageurs d''affaires', 2);

-- Insertion de l'utilisateur admin
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('admin-001', 'admin@chateauroyal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

INSERT INTO profiles (id, first_name, last_name, phone, is_admin, profile_image) VALUES
('admin-001', 'Arnaud', 'Barotteaux', '0644762721', TRUE, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');

-- Insertion des utilisateurs de test
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('user-001', 'client1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('user-002', 'client2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('user-003', 'client3@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('user-004', 'marie.dupont@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('user-005', 'jean.martin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

INSERT INTO profiles (id, first_name, last_name, phone, is_admin) VALUES
('user-001', 'Marie', 'Dubois', '0123456789', FALSE),
('user-002', 'Pierre', 'Martin', '0987654321', FALSE),
('user-003', 'Sophie', 'Leroy', '0147258369', FALSE),
('user-004', 'Marie', 'Dupont', '0156789123', FALSE),
('user-005', 'Jean', 'Martin', '0198765432', FALSE);

-- Insertion massive des chambres (108 chambres au total)
INSERT INTO rooms (id, name, category_id, beds, has_view, images, description, amenities, price_night, price_three_days, price_week, price_month, total_reservations) VALUES

-- SUITES PRÉSIDENTIELLES (18 chambres)
('room-001', 'Suite Royale Versailles', 'cat-1', 1, TRUE, 
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite d''exception avec vue panoramique sur les jardins du château. Décoration raffinée avec mobilier d''époque Louis XVI.',
'["Jacuzzi privé", "Cheminée", "Balcon panoramique", "Service de majordome 24h", "Minibar premium", "Dressing walk-in"]',
1200.00, 3200.00, 7000.00, 25000.00, 25),

('room-002', 'Suite Impériale Napoléon', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite prestigieuse avec salon privé et vue sur la cour d''honneur. Mobilier Empire authentique.',
'["Salon privé", "Piano à queue", "Cheminée marbre", "Service majordome", "Champagne d''accueil", "Terrasse privée"]',
1500.00, 4000.00, 8500.00, 30000.00, 18),

('room-003', 'Suite Royale Marie-Antoinette', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite féminine et raffinée avec boudoir et vue sur les jardins à la française.',
'["Boudoir privé", "Baignoire en marbre", "Dressing de luxe", "Service de femme de chambre", "Produits Hermès", "Balcon fleuri"]',
1400.00, 3800.00, 8000.00, 28000.00, 22),

('room-004', 'Suite Présidentielle De Gaulle', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite moderne et élégante avec bureau présidentiel et vue panoramique.',
'["Bureau présidentiel", "Salle de réunion", "Système audiovisuel", "Service de secrétariat", "Wifi premium", "Terrasse 360°"]',
1600.00, 4200.00, 9000.00, 32000.00, 15),

('room-005', 'Suite Royale Louis XIV', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'La plus prestigieuse de nos suites, inspirée du Roi-Soleil avec dorures et tapisseries.',
'["Lit à baldaquin", "Salon de réception", "Cheminée dorée", "Service royal complet", "Champagne Cristal", "Jardin privatif"]',
2000.00, 5500.00, 12000.00, 40000.00, 12),

('room-006', 'Suite Impériale Joséphine', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite romantique avec spa privatif et vue sur les jardins romantiques.',
'["Spa privatif", "Hammam privé", "Massage sur demande", "Pétales de rose", "Champagne rosé", "Bain à remous"]',
1800.00, 4800.00, 10500.00, 35000.00, 20),

('room-007', 'Suite Royale Catherine de Médicis', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite historique avec bibliothèque privée et vue sur les jardins italiens.',
'["Bibliothèque privée", "Cheminée Renaissance", "Mobilier d''époque", "Service de bibliothécaire", "Salon de lecture", "Terrasse jardin"]',
1350.00, 3600.00, 7800.00, 27000.00, 16),

('room-008', 'Suite Impériale Bonaparte', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite militaire avec salle d''armes et vue sur la cour d''honneur.',
'["Salle d''armes", "Collection d''épées", "Bureau de campagne", "Cartes anciennes", "Service militaire", "Balcon d''honneur"]',
1450.00, 3900.00, 8200.00, 29000.00, 14),

('room-009', 'Suite Royale Diane de Poitiers', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite élégante avec salon de beauté privé et vue sur les jardins de Diane.',
'["Salon de beauté", "Produits de luxe", "Miroirs vénitiens", "Service esthéticienne", "Bain de lait", "Jardin privé"]',
1300.00, 3500.00, 7500.00, 26000.00, 19),

('room-010', 'Suite Présidentielle Mitterrand', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite moderne avec bureau présidentiel et équipements high-tech.',
'["Bureau high-tech", "Visioconférence", "Secrétariat", "Sécurité renforcée", "Wifi diplomatique", "Salon officiel"]',
1550.00, 4100.00, 8800.00, 31000.00, 13),

('room-011', 'Suite Royale Henri IV', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite rustique chic avec cheminée monumentale et vue sur les vignobles.',
'["Cheminée monumentale", "Cave à vins", "Dégustation privée", "Mobilier rustique chic", "Terrasse vignoble", "Service sommelier"]',
1250.00, 3300.00, 7200.00, 25500.00, 21),

('room-012', 'Suite Impériale Eugénie', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite Second Empire avec salon de musique et vue sur l''orangerie.',
'["Salon de musique", "Piano Pleyel", "Harpe dorée", "Concerts privés", "Acoustique parfaite", "Terrasse orangerie"]',
1650.00, 4400.00, 9500.00, 33000.00, 11),

('room-013', 'Suite Royale Anne d''Autriche', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite baroque avec chapelle privée et vue sur les jardins monastiques.',
'["Chapelle privée", "Orgue baroque", "Vitraux anciens", "Service religieux", "Méditation", "Jardin monastique"]',
1400.00, 3750.00, 8100.00, 28500.00, 17),

('room-014', 'Suite Présidentielle Pompidou', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite contemporaine avec galerie d''art et vue sur le parc moderne.',
'["Galerie d''art", "Œuvres contemporaines", "Éclairage muséal", "Vernissages privés", "Atelier d''artiste", "Terrasse sculpture"]',
1750.00, 4700.00, 10200.00, 36000.00, 9),

('room-015', 'Suite Royale Marguerite de Valois', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite littéraire avec salon d''écriture et vue sur la bibliothèque.',
'["Salon d''écriture", "Bureau d''écrivain", "Manuscrits anciens", "Service de copiste", "Plumes d''oie", "Jardin des poètes"]',
1320.00, 3550.00, 7600.00, 26500.00, 18),

('room-016', 'Suite Impériale Maximilien', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite austro-hongroise avec salle de bal privée et vue sur les jardins viennois.',
'["Salle de bal", "Orchestre privé", "Valses viennoises", "Costumes d''époque", "Bal masqué", "Terrasse dansante"]',
1850.00, 4950.00, 10800.00, 38000.00, 8),

('room-017', 'Suite Royale Blanche de Castille', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite médiévale avec tour privée et vue sur les remparts.',
'["Tour privée", "Escalier en colimaçon", "Meurtrières", "Armures médiévales", "Banquet médiéval", "Remparts"]',
1280.00, 3400.00, 7300.00, 25800.00, 20),

('room-018', 'Suite Présidentielle Chirac', 'cat-1', 1, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite conviviale avec cuisine gastronomique et vue sur les jardins potagers.',
'["Cuisine gastronomique", "Chef privé", "Potager bio", "Dégustation", "Cours de cuisine", "Terrasse gourmande"]',
1480.00, 3950.00, 8400.00, 29500.00, 15),

-- CHAMBRES DE LUXE (24 chambres)
('room-019', 'Chambre Noble Loire', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre élégante avec deux lits king-size et vue sur la vallée de la Loire.',
'["Salle de bain marbre", "Terrasse privée", "Wifi haut débit", "Coffre-fort", "Peignoirs Hermès", "Minibar"]',
450.00, 1200.00, 2800.00, 10000.00, 32),

('room-020', 'Chambre Aristocrate Seine', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre parisienne avec vue sur les jardins à la française.',
'["Parquet Versailles", "Moulures dorées", "Cheminée Louis XV", "Balcon fer forgé", "Service thé", "Bibliothèque"]',
420.00, 1150.00, 2650.00, 9500.00, 28),

('room-021', 'Chambre Duchesse Rhône', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre provençale avec terrasse fleurie et vue sur les lavandes.',
'["Terrasse lavande", "Mobilier provençal", "Tissus Souleiado", "Parfums Grasse", "Petit-déjeuner terrasse", "Jardin aromatique"]',
380.00, 1050.00, 2400.00, 8800.00, 35),

('room-022', 'Chambre Marquise Garonne', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre bordelaise avec cave à vins et vue sur les vignobles.',
'["Cave à vins", "Dégustation", "Mobilier bordelais", "Terrasse vignoble", "Service sommelier", "Cours œnologie"]',
480.00, 1280.00, 2950.00, 10500.00, 26),

('room-023', 'Chambre Comtesse Dordogne', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre périgourdine avec cheminée et vue sur les truffières.',
'["Cheminée pierre", "Mobilier périgourdin", "Dégustation truffes", "Terrasse forêt", "Promenade nature", "Gastronomie locale"]',
360.00, 980.00, 2250.00, 8200.00, 31),

('room-024', 'Chambre Baronne Savoie', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre alpine avec chalet de luxe et vue sur les montagnes.',
'["Style chalet", "Poêle en faïence", "Fourrures", "Terrasse montagne", "Fondue savoyarde", "Ski privatif"]',
520.00, 1400.00, 3200.00, 11500.00, 22),

('room-025', 'Chambre Vicomtesse Bretagne', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre bretonne avec vue sur l''océan et mobilier marin.',
'["Vue océan", "Mobilier marin", "Coquillages", "Terrasse marine", "Fruits de mer", "Promenade côtière"]',
440.00, 1180.00, 2700.00, 9800.00, 29),

('room-026', 'Chambre Princesse Normandie', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre normande avec colombages et vue sur les pommiers.',
'["Colombages", "Mobilier normand", "Cidre artisanal", "Terrasse verger", "Calvados", "Fromages normands"]',
400.00, 1100.00, 2500.00, 9200.00, 33),

('room-027', 'Chambre Duchesse Alsace', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre alsacienne avec poêle en faïence et vue sur les vignes.',
'["Poêle faïence", "Mobilier alsacien", "Vins d''Alsace", "Terrasse vignes", "Choucroute", "Musique folklorique"]',
460.00, 1220.00, 2800.00, 10200.00, 27),

('room-028', 'Chambre Marquise Champagne', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre champenoise avec cave à champagne et vue sur les coteaux.',
'["Cave champagne", "Dégustation bulles", "Mobilier champenois", "Terrasse coteaux", "Vendanges", "Sabrage"]',
550.00, 1480.00, 3400.00, 12000.00, 19),

('room-029', 'Chambre Comtesse Bourgogne', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre bourguignonne avec cellier et vue sur les grands crus.',
'["Cellier privé", "Grands crus", "Mobilier bourguignon", "Terrasse vignoble", "Escargots", "Route des vins"]',
580.00, 1550.00, 3600.00, 12800.00, 16),

('room-030', 'Chambre Baronne Languedoc', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre méditerranéenne avec patio et vue sur les oliviers.',
'["Patio privé", "Oliviers centenaires", "Mobilier méditerranéen", "Terrasse oliveraie", "Huile d''olive", "Tapenade"]',
390.00, 1080.00, 2450.00, 8900.00, 34),

('room-031', 'Chambre Vicomtesse Corse', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre corse avec maquis et vue sur la mer Méditerranée.',
'["Vue mer", "Maquis corse", "Mobilier insulaire", "Terrasse marine", "Charcuterie corse", "Miel de châtaignier"]',
470.00, 1260.00, 2900.00, 10600.00, 25),

('room-032', 'Chambre Princesse Picardie', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre picarde avec jardin potager et vue sur les champs.',
'["Jardin potager", "Légumes bio", "Mobilier picard", "Terrasse champêtre", "Maroilles", "Ficelle picarde"]',
350.00, 950.00, 2200.00, 8000.00, 36),

('room-033', 'Chambre Duchesse Limousin', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre limousine avec étang et vue sur les prairies.',
'["Vue étang", "Prairies verdoyantes", "Mobilier limousin", "Terrasse nature", "Bœuf limousin", "Pêche privée"]',
370.00, 1000.00, 2300.00, 8400.00, 30),

('room-034', 'Chambre Marquise Auvergne', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre auvergnate avec cheminée volcanique et vue sur les puys.',
'["Pierre volcanique", "Cheminée monumentale", "Mobilier auvergnat", "Terrasse puys", "Fromages AOP", "Randonnée volcans"]',
410.00, 1120.00, 2550.00, 9300.00, 28),

('room-035', 'Chambre Comtesse Franche-Comté', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre franc-comtoise avec horlogerie et vue sur les sapins.',
'["Horlogerie ancienne", "Bois de sapin", "Mobilier comtois", "Terrasse forêt", "Comté affiné", "Vin jaune"]',
430.00, 1160.00, 2650.00, 9600.00, 26),

('room-036', 'Chambre Baronne Lorraine', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre lorraine avec cristallerie et vue sur les mirabelliers.',
'["Cristal de Baccarat", "Mirabelliers", "Mobilier lorrain", "Terrasse verger", "Mirabelle", "Quiche lorraine"]',
450.00, 1200.00, 2750.00, 9900.00, 24),

('room-037', 'Chambre Vicomtesse Ardennes', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre ardennaise avec forge et vue sur la forêt.',
'["Forge artisanale", "Fer forgé", "Mobilier ardennais", "Terrasse forêt", "Sanglier", "Bière artisanale"]',
380.00, 1040.00, 2400.00, 8700.00, 32),

('room-038', 'Chambre Princesse Nord', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre nordiste avec estaminet et vue sur les beffrois.',
'["Estaminet privé", "Beffrois", "Mobilier ch''ti", "Terrasse urbaine", "Carbonnade", "Bière du Nord"]',
360.00, 980.00, 2250.00, 8200.00, 35),

('room-039', 'Chambre Duchesse Poitou', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre poitevine avec marais et vue sur les canaux.',
'["Marais poitevin", "Barque privée", "Mobilier poitevin", "Terrasse canal", "Anguille", "Promenade barque"]',
390.00, 1060.00, 2450.00, 8800.00, 29),

('room-040', 'Chambre Marquise Berry', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre berrichonne avec étang et vue sur les châteaux.',
'["Étang privé", "Châteaux Loire", "Mobilier berrichon", "Terrasse château", "Crottin Chavignol", "Sancerre"]',
420.00, 1140.00, 2600.00, 9400.00, 27),

('room-041', 'Chambre Comtesse Vendée', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre vendéenne avec cabane de plage et vue sur l''océan.',
'["Cabane plage", "Vue océan Atlantique", "Mobilier vendéen", "Terrasse marine", "Huîtres", "Sel de Guérande"]',
440.00, 1180.00, 2700.00, 9700.00, 25),

('room-042', 'Chambre Baronne Touraine', 'cat-2', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre tourangelle avec roseraie et vue sur la Loire.',
'["Roseraie privée", "Loire royale", "Mobilier Renaissance", "Terrasse fleuve", "Rillettes", "Vouvray"]',
460.00, 1240.00, 2850.00, 10300.00, 23),

-- CHAMBRES FAMILIALES (18 chambres)
('room-043', 'Chambre Familiale Château', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Spacieuse chambre familiale avec quatre lits, idéale pour les familles. Décoration chaleureuse.',
'["Réfrigérateur", "Espace salon", "Salle de bain familiale", "Télévision", "Climatisation", "Jeux enfants"]',
320.00, 850.00, 2000.00, 7500.00, 45),

('room-044', 'Chambre Familiale Princesse', 'cat-3', 6, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Grande chambre familiale avec six couchages et vue sur les jardins.',
'["Lits superposés", "Coin jeux", "Kitchenette", "Balcon sécurisé", "Baby-sitting", "Activités enfants"]',
420.00, 1120.00, 2600.00, 9500.00, 38),

('room-045', 'Chambre Familiale Conte de Fées', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre thématique conte de fées avec décoration magique.',
'["Décor féerique", "Lit château", "Costumes princesse", "Spectacle privé", "Goûter royal", "Jardin magique"]',
380.00, 1000.00, 2300.00, 8500.00, 42),

('room-046', 'Chambre Familiale Aventuriers', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre d''aventure avec décoration exploration et activités.',
'["Décor aventure", "Carte au trésor", "Chasse au trésor", "Équipement exploration", "Guide privé", "Parcours aventure"]',
350.00, 920.00, 2150.00, 8000.00, 40),

('room-047', 'Chambre Familiale Safari', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre thème safari avec animaux en peluche et vue sur le parc.',
'["Décor safari", "Animaux peluche", "Jumelles enfants", "Safari photo", "Soigneur animalier", "Parc animalier"]',
390.00, 1040.00, 2400.00, 8800.00, 36),

('room-048', 'Chambre Familiale Pirates', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre pirate avec bateau-lit et activités nautiques.',
'["Bateau-lit", "Costumes pirates", "Chasse trésor", "Bataille navale", "Capitaine privé", "Aventure maritime"]',
360.00, 960.00, 2200.00, 8200.00, 44),

('room-049', 'Chambre Familiale Espace', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre spatiale avec planétarium et vue sur les étoiles.',
'["Planétarium privé", "Télescope", "Combinaisons astronaute", "Mission spatiale", "Astronome privé", "Observation étoiles"]',
450.00, 1200.00, 2800.00, 10200.00, 28),

('room-050', 'Chambre Familiale Médiévale', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre médiévale avec château fort et activités chevalerie.',
'["Château fort", "Armures enfants", "Tournoi chevalerie", "Banquet médiéval", "Chevalier privé", "Cour d''honneur"]',
370.00, 980.00, 2250.00, 8400.00, 41),

('room-051', 'Chambre Familiale Jungle', 'cat-3', 6, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Grande chambre jungle avec cabane dans les arbres.',
'["Cabane arbres", "Décor jungle", "Animaux exotiques", "Exploration nature", "Guide jungle", "Serre tropicale"]',
480.00, 1280.00, 2950.00, 10800.00, 25),

('room-052', 'Chambre Familiale Cirque', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre cirque avec chapiteau et spectacles privés.',
'["Chapiteau privé", "Costumes cirque", "Spectacle clowns", "Jonglage", "Acrobaties", "Piste cirque"]',
340.00, 900.00, 2100.00, 7800.00, 43),

('room-053', 'Chambre Familiale Océan', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre océanique avec aquarium géant et vue sur l''eau.',
'["Aquarium géant", "Poissons tropicaux", "Plongée virtuelle", "Exploration marine", "Biologiste marin", "Bassin tactile"]',
410.00, 1100.00, 2550.00, 9300.00, 33),

('room-054', 'Chambre Familiale Dinosaures', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre préhistorique avec fossiles et fouilles archéologiques.',
'["Fossiles authentiques", "Fouilles archéo", "Costumes explorateur", "Paléontologue", "Musée privé", "Excavation"]',
380.00, 1020.00, 2350.00, 8600.00, 39),

('room-055', 'Chambre Familiale Robots', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre futuriste avec robots interactifs et technologie.',
'["Robots interactifs", "Réalité virtuelle", "Programmation", "Intelligence artificielle", "Ingénieur privé", "Laboratoire tech"]',
460.00, 1240.00, 2850.00, 10400.00, 26),

('room-056', 'Chambre Familiale Musique', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre musicale avec instruments et studio d''enregistrement.',
'["Studio enregistrement", "Instruments variés", "Cours musique", "Concert privé", "Professeur musique", "Salle concert"]',
400.00, 1080.00, 2500.00, 9100.00, 34),

('room-057', 'Chambre Familiale Art', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre artistique avec atelier de peinture et galerie.',
'["Atelier peinture", "Matériel artistique", "Cours peinture", "Exposition privée", "Artiste résident", "Galerie personnelle"]',
420.00, 1140.00, 2650.00, 9600.00, 31),

('room-058', 'Chambre Familiale Sport', 'cat-3', 4, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre sportive avec équipements et terrain privé.',
'["Équipements sport", "Terrain privé", "Coach personnel", "Compétitions", "Matériel pro", "Salle fitness"]',
390.00, 1050.00, 2450.00, 8900.00, 37),

('room-059', 'Chambre Familiale Nature', 'cat-3', 6, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Grande chambre nature avec jardin botanique et serre.',
'["Jardin botanique", "Serre privée", "Cours botanique", "Herboriste", "Potager bio", "Ruches pédagogiques"]',
440.00, 1180.00, 2750.00, 10000.00, 29),

('room-060', 'Chambre Familiale Magie', 'cat-3', 4, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre magique avec spectacles de magie et école de sorcellerie.',
'["École sorcellerie", "Spectacles magie", "Baguettes magiques", "Potions", "Magicien résident", "Bibliothèque sorts"]',
470.00, 1260.00, 2900.00, 10600.00, 24),

-- CHAMBRES STANDARD PLUS (18 chambres)
('room-061', 'Chambre Élégance Classique', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre classique avec mobilier de qualité et confort moderne.',
'["Mobilier qualité", "Literie premium", "Salle de bain moderne", "Wifi gratuit", "Coffre-fort", "Service étage"]',
280.00, 750.00, 1750.00, 6500.00, 52),

('room-062', 'Chambre Confort Moderne', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre moderne avec vue partielle sur les jardins.',
'["Design contemporain", "Vue jardins", "Climatisation", "Télévision HD", "Minibar", "Balcon"]',
300.00, 800.00, 1850.00, 6800.00, 48),

('room-063', 'Chambre Charme Bourgeois', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre bourgeoise avec charme d''antan et équipements modernes.',
'["Charme ancien", "Parquet ciré", "Moulures", "Cheminée déco", "Mobilier époque", "Confort moderne"]',
260.00, 700.00, 1650.00, 6200.00, 55),

('room-064', 'Chambre Style Contemporain', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre au design contemporain avec vue sur le parc.',
'["Design épuré", "Vue parc", "Éclairage LED", "Douche italienne", "Dressing", "Bureau design"]',
320.00, 850.00, 1950.00, 7200.00, 44),

('room-065', 'Chambre Tradition Française', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre traditionnelle française avec mobilier authentique.',
'["Mobilier français", "Tissus traditionnels", "Tomettes", "Poutres apparentes", "Coin lecture", "Ambiance cosy"]',
270.00, 720.00, 1700.00, 6400.00, 51),

('room-066', 'Chambre Zen Moderne', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre zen avec décoration épurée et vue apaisante.',
'["Décor zen", "Couleurs apaisantes", "Matériaux naturels", "Coin méditation", "Diffuseur huiles", "Vue nature"]',
290.00, 780.00, 1800.00, 6600.00, 47),

('room-067', 'Chambre Business Confort', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre équipée pour les voyageurs d''affaires.',
'["Bureau ergonomique", "Wifi pro", "Imprimante", "Fax", "Téléphone", "Service secrétariat"]',
310.00, 830.00, 1900.00, 7000.00, 42),

('room-068', 'Chambre Cocooning', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre douillette avec ambiance cocooning et vue relaxante.',
'["Ambiance cosy", "Textiles doux", "Éclairage tamisé", "Coin détente", "Thé premium", "Vue relaxante"]',
285.00, 760.00, 1780.00, 6550.00, 49),

('room-069', 'Chambre Art Déco', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre style Art Déco avec mobilier années 30.',
'["Style Art Déco", "Mobilier 1930", "Dorures", "Miroirs biseautés", "Luminaires époque", "Élégance rétro"]',
295.00, 790.00, 1820.00, 6700.00, 46),

('room-070', 'Chambre Minimaliste', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre minimaliste avec design épuré et vue dégagée.',
'["Design minimaliste", "Lignes épurées", "Couleurs neutres", "Rangements cachés", "Éclairage indirect", "Vue dégagée"]',
275.00, 740.00, 1720.00, 6350.00, 50),

('room-071', 'Chambre Vintage Chic', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre vintage avec mobilier chiné et décoration rétro.',
'["Mobilier vintage", "Objets chinés", "Papier peint rétro", "Vinyles", "Tourne-disque", "Ambiance 70s"]',
265.00, 710.00, 1680.00, 6300.00, 53),

('room-072', 'Chambre Industrielle', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre style industriel avec matériaux bruts et vue urbaine.',
'["Style industriel", "Métal et bois", "Briques apparentes", "Luminaires métal", "Mobilier brut", "Vue urbaine"]',
305.00, 820.00, 1880.00, 6900.00, 43),

('room-073', 'Chambre Scandinave', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre style scandinave avec bois clair et textiles naturels.',
'["Style nordique", "Bois clair", "Textiles naturels", "Hygge", "Fourrures", "Ambiance chaleureuse"]',
280.00, 750.00, 1750.00, 6450.00, 48),

('room-074', 'Chambre Bohème', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre bohème avec textiles colorés et vue sur les jardins.',
'["Style bohème", "Textiles colorés", "Macramé", "Plantes", "Coussins ethniques", "Vue jardins"]',
290.00, 780.00, 1800.00, 6600.00, 45),

('room-075', 'Chambre Classique Moderne', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre alliant classique et modernité avec équipements actuels.',
'["Classique moderne", "Mobilier intemporel", "Technologies actuelles", "Confort optimal", "Élégance", "Fonctionnalité"]',
300.00, 800.00, 1850.00, 6750.00, 44),

('room-076', 'Chambre Romantique Douce', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre romantique avec décoration douce et vue sur les jardins.',
'["Décor romantique", "Couleurs douces", "Dentelles", "Bougies", "Pétales roses", "Vue jardins"]',
285.00, 760.00, 1780.00, 6500.00, 47),

('room-077', 'Chambre Urbaine Chic', 'cat-4', 2, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre urbaine avec design contemporain et équipements modernes.',
'["Design urbain", "Lignes modernes", "Matériaux nobles", "Technologie", "Confort city", "Style métropolitain"]',
315.00, 840.00, 1920.00, 7100.00, 41),

('room-078', 'Chambre Nature Zen', 'cat-4', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre inspirée par la nature avec matériaux écologiques.',
'["Matériaux éco", "Plantes vertes", "Bois naturel", "Pierre", "Ambiance nature", "Vue verdoyante"]',
295.00, 790.00, 1820.00, 6650.00, 46),

-- SUITES JUNIOR (12 chambres)
('room-079', 'Suite Junior Élégance', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior avec salon séparé et vue sur les jardins.',
'["Salon séparé", "Coin bureau", "Kitchenette", "Balcon privé", "Service premium", "Vue jardins"]',
580.00, 1550.00, 3600.00, 13000.00, 35),

('room-080', 'Suite Junior Prestige', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior de prestige avec équipements haut de gamme.',
'["Équipements luxe", "Mobilier design", "Salle bain marbre", "Dressing", "Terrasse", "Service concierge"]',
620.00, 1650.00, 3800.00, 13800.00, 28),

('room-081', 'Suite Junior Moderne', 'cat-5', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior moderne avec design contemporain.',
'["Design moderne", "Technologie avancée", "Éclairage intelligent", "Domotique", "Confort high-tech", "Style futuriste"]',
560.00, 1500.00, 3450.00, 12500.00, 32),

('room-082', 'Suite Junior Classique', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior classique avec mobilier d''époque.',
'["Mobilier époque", "Parquet marqueterie", "Cheminée", "Bibliothèque", "Salon lecture", "Vue château"]',
600.00, 1600.00, 3700.00, 13400.00, 30),

('room-083', 'Suite Junior Romantique', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior romantique avec jacuzzi et vue sur les jardins.',
'["Jacuzzi privatif", "Décor romantique", "Pétales roses", "Champagne", "Massage couple", "Vue romantique"]',
680.00, 1800.00, 4100.00, 14800.00, 22),

('room-084', 'Suite Junior Business', 'cat-5', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior équipée pour les voyageurs d''affaires.',
'["Bureau équipé", "Salle réunion", "Wifi pro", "Secrétariat", "Visioconférence", "Service business"]',
640.00, 1700.00, 3900.00, 14200.00, 26),

('room-085', 'Suite Junior Zen', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior zen avec espace méditation et vue apaisante.',
'["Espace méditation", "Décor zen", "Matériaux naturels", "Silence", "Bien-être", "Vue nature"]',
590.00, 1580.00, 3650.00, 13200.00, 33),

('room-086', 'Suite Junior Artistique', 'cat-5', 2, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior avec atelier d''artiste et galerie privée.',
'["Atelier artiste", "Galerie privée", "Matériel peinture", "Éclairage atelier", "Œuvres art", "Inspiration créative"]',
650.00, 1750.00, 4000.00, 14500.00, 24),

('room-087', 'Suite Junior Musicale', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior avec piano et acoustique parfaite.',
'["Piano à queue", "Acoustique parfaite", "Instruments", "Partition", "Enregistrement", "Concert privé"]',
700.00, 1850.00, 4200.00, 15200.00, 20),

('room-088', 'Suite Junior Gastronomique', 'cat-5', 2, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior avec cuisine équipée et chef privé.',
'["Cuisine équipée", "Chef privé", "Cours cuisine", "Dégustation", "Cave vins", "Gastronomie"]',
720.00, 1900.00, 4300.00, 15600.00, 18),

('room-089', 'Suite Junior Wellness', 'cat-5', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior avec spa privatif et soins bien-être.',
'["Spa privatif", "Sauna", "Hammam", "Massage", "Soins corps", "Relaxation totale"]',
750.00, 1980.00, 4500.00, 16200.00, 16),

('room-090', 'Suite Junior Vintage', 'cat-5', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Suite junior vintage avec mobilier d''époque et charme rétro.',
'["Mobilier vintage", "Objets époque", "Charme rétro", "Collection", "Antiquités", "Nostalgie"]',
570.00, 1520.00, 3500.00, 12800.00, 34),

-- CHAMBRES ROMANTIQUES (12 chambres)
('room-091', 'Chambre Romantique Passion', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre romantique avec jacuzzi privatif et vue sur les jardins.',
'["Jacuzzi privatif", "Lit rond", "Pétales roses", "Champagne rosé", "Massage couple", "Vue romantique"]',
520.00, 1400.00, 3200.00, 11500.00, 38),

('room-092', 'Chambre Romantique Séduction', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre séduction avec ambiance tamisée et équipements intimes.',
'["Éclairage tamisé", "Bougies parfumées", "Musique douce", "Chocolats", "Lingerie fine", "Ambiance intime"]',
480.00, 1280.00, 2950.00, 10800.00, 42),

('room-093', 'Chambre Romantique Tendresse', 'cat-6', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre tendresse avec décoration douce et cocooning.',
'["Décor doux", "Textiles soyeux", "Coussins moelleux", "Thé d''amour", "Poésie", "Douceur"]',
450.00, 1200.00, 2750.00, 10200.00, 45),

('room-094', 'Chambre Romantique Évasion', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre évasion avec terrasse privée et vue panoramique.',
'["Terrasse privée", "Vue panoramique", "Bain à remous", "Coucher soleil", "Dîner romantique", "Étoiles"]',
580.00, 1550.00, 3600.00, 13000.00, 32),

('room-095', 'Chambre Romantique Charme', 'cat-6', 2, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre charme avec cheminée et ambiance feutrée.',
'["Cheminée romantique", "Fauteuils câlins", "Plaids doux", "Vin chaud", "Lecture", "Intimité"]',
460.00, 1240.00, 2850.00, 10400.00, 40),

('room-096', 'Chambre Romantique Lune de Miel', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre lune de miel avec lit à baldaquin et vue féerique.',
'["Lit baldaquin", "Voilages blancs", "Fleurs fraîches", "Petit-déjeuner lit", "Photos souvenir", "Vue féerique"]',
600.00, 1600.00, 3700.00, 13500.00, 28),

('room-097', 'Chambre Romantique Passion Rouge', 'cat-6', 2, FALSE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre passion avec décoration rouge et ambiance sensuelle.',
'["Décor rouge passion", "Velours", "Miroirs", "Parfums enivrants", "Musique sensuelle", "Ambiance chaude"]',
540.00, 1450.00, 3350.00, 12200.00, 35),

('room-098', 'Chambre Romantique Blanc Pur', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre blanc pur avec décoration épurée et vue céleste.',
'["Blanc immaculé", "Décor épuré", "Lumière naturelle", "Pureté", "Sérénité", "Vue céleste"]',
500.00, 1350.00, 3100.00, 11200.00, 39),

('room-099', 'Chambre Romantique Rose Tendre', 'cat-6', 2, FALSE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre rose tendre avec décoration délicate et romantique.',
'["Rose tendre", "Dentelles", "Broderies", "Parfum rose", "Douceur féminine", "Romantisme"]',
470.00, 1260.00, 2900.00, 10600.00, 43),

('room-100', 'Chambre Romantique Dorée', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre dorée avec luxe et raffinement pour moments précieux.',
'["Dorures", "Luxe raffiné", "Cristal", "Soie", "Précieux", "Vue dorée"]',
620.00, 1650.00, 3800.00, 13800.00, 26),

('room-101', 'Chambre Romantique Violette', 'cat-6', 2, FALSE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre violette avec parfums de Provence et charme méditerranéen.',
'["Violet lavande", "Parfums Provence", "Herbes aromatiques", "Charme méditerranéen", "Détente", "Bien-être"]',
490.00, 1320.00, 3050.00, 11000.00, 41),

('room-102', 'Chambre Romantique Émeraude', 'cat-6', 2, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Chambre émeraude avec décoration précieuse et vue sur l''émeraude des jardins.',
'["Vert émeraude", "Pierres précieuses", "Décor raffiné", "Jardins verts", "Nature luxuriante", "Harmonie"]',
550.00, 1480.00, 3400.00, 12400.00, 33),

-- PENTHOUSES ROYAUX (6 chambres)
('room-103', 'Penthouse Royal Suprême', 'cat-7', 4, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Penthouse royal avec terrasse panoramique et services ultra-luxe.',
'["Terrasse 360°", "Piscine privée", "Héliport", "Majordome 24h", "Chef étoilé", "Sécurité VIP"]',
2500.00, 6800.00, 15000.00, 55000.00, 8),

('room-104', 'Penthouse Royal Prestige', 'cat-7', 4, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Penthouse prestige avec salon de réception et vue exceptionnelle.',
'["Salon réception", "Salle à manger", "Cuisine pro", "Sommelier", "Service traiteur", "Vue exceptionnelle"]',
2200.00, 6000.00, 13500.00, 48000.00, 10),

('room-105', 'Penthouse Royal Moderne', 'cat-7', 4, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Penthouse moderne avec domotique avancée et technologie de pointe.',
'["Domotique avancée", "Technologie pointe", "Écrans géants", "Son surround", "Éclairage intelligent", "Confort futuriste"]',
2300.00, 6200.00, 14000.00, 50000.00, 9),

('room-106', 'Penthouse Royal Artistique', 'cat-7', 4, TRUE,
'["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Penthouse artistique avec galerie d''art et atelier créatif.',
'["Galerie art privée", "Atelier créatif", "Œuvres originales", "Artiste résident", "Vernissages", "Inspiration artistique"]',
2400.00, 6500.00, 14500.00, 52000.00, 7),

('room-107', 'Penthouse Royal Wellness', 'cat-7', 4, TRUE,
'["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Penthouse wellness avec spa complet et centre de bien-être.',
'["Spa complet", "Salle fitness", "Yoga privé", "Méditation", "Soins premium", "Bien-être total"]',
2600.00, 7000.00, 15500.00, 56000.00, 6),

('room-108', 'Penthouse Royal Gastronomique', 'cat-7', 4, TRUE,
'["https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"]',
'Penthouse gastronomique avec cuisine étoilée et cave exceptionnelle.',
'["Cuisine étoilée", "Chef Michelin", "Cave exceptionnelle", "Dégustation", "Cours cuisine", "Gastronomie ultime"]',
2800.00, 7500.00, 16500.00, 60000.00, 5);

-- Insertion de quelques réservations d'exemple
INSERT INTO bookings (id, user_id, room_id, check_in, check_out, guests, duration_type, total_amount, status, payment_status) VALUES
('booking-001', 'user-001', 'room-001', '2024-01-15', '2024-01-16', 2, 'night', 1200.00, 'completed', 'paid'),
('booking-002', 'user-002', 'room-019', '2024-01-20', '2024-01-23', 2, 'threeDays', 1200.00, 'confirmed', 'paid'),
('booking-003', 'user-003', 'room-043', '2024-02-01', '2024-02-08', 4, 'week', 2000.00, 'pending', 'pending'),
('booking-004', 'user-001', 'room-091', '2024-02-14', '2024-02-15', 2, 'night', 520.00, 'confirmed', 'paid'),
('booking-005', 'user-002', 'room-103', '2024-03-01', '2024-03-04', 4, 'threeDays', 6800.00, 'confirmed', 'paid');

-- Insertion de quelques messages de contact d'exemple
INSERT INTO contact_messages (id, name, email, phone, subject, message, contact_method, status) VALUES
('contact-001', 'Marie Dupont', 'marie.dupont@example.com', '0123456789', 'Réservation mariage', 'Bonjour, je souhaiterais organiser mon mariage dans votre château...', 'email', 'new'),
('contact-002', 'Pierre Martin', 'pierre.martin@example.com', '0987654321', 'Événement entreprise', 'Nous cherchons un lieu pour notre séminaire d''entreprise...', 'phone', 'read'),
('contact-003', 'Sophie Leroy', 'sophie.leroy@example.com', '0147258369', 'Demande de tarifs', 'Pourriez-vous m''envoyer vos tarifs pour un séjour en famille...', 'email', 'replied');

-- =====================================================
-- VUES ET PROCÉDURES UTILES
-- =====================================================

-- Vue pour les statistiques des chambres
CREATE VIEW room_statistics AS
SELECT 
    rc.name as category_name,
    COUNT(r.id) as total_rooms,
    SUM(CASE WHEN r.available = TRUE THEN 1 ELSE 0 END) as available_rooms,
    SUM(CASE WHEN r.available = FALSE THEN 1 ELSE 0 END) as occupied_rooms,
    AVG(r.price_night) as avg_price_night,
    SUM(r.total_reservations) as total_reservations
FROM rooms r
LEFT JOIN room_categories rc ON r.category_id = rc.id
GROUP BY rc.id, rc.name;

-- Vue pour les revenus par mois
CREATE VIEW monthly_revenue AS
SELECT 
    YEAR(b.created_at) as year,
    MONTH(b.created_at) as month,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    AVG(b.total_amount) as avg_booking_value
FROM bookings b
WHERE b.payment_status = 'paid'
GROUP BY YEAR(b.created_at), MONTH(b.created_at)
ORDER BY year DESC, month DESC;

-- =====================================================
-- INDEX POUR OPTIMISATION
-- =====================================================

CREATE INDEX idx_rooms_price_range ON rooms(price_night, price_week, price_month);
CREATE INDEX idx_bookings_date_range ON bookings(check_in, check_out, status);
CREATE INDEX idx_profiles_admin_active ON profiles(is_admin, created_at);
CREATE INDEX idx_contact_messages_status_date ON contact_messages(status, created_at);

-- =====================================================
-- TRIGGERS POUR AUTOMATISATION
-- =====================================================

-- Trigger pour mettre à jour le compteur de réservations
DELIMITER //
CREATE TRIGGER update_room_reservations 
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    UPDATE rooms 
    SET total_reservations = total_reservations + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.room_id;
END//
DELIMITER ;

-- Trigger pour mettre à jour la disponibilité des chambres
DELIMITER //
CREATE TRIGGER update_room_availability
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE rooms 
        SET available = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.room_id;
    ELSEIF NEW.status = 'completed' OR NEW.status = 'cancelled' THEN
        UPDATE rooms 
        SET available = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.room_id;
    END IF;
END//
DELIMITER ;

-- =====================================================
-- DONNÉES DE CONFIGURATION
-- =====================================================

-- Insertion des paramètres du site
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_name', 'Château Royal', 'Nom du site'),
('contact_email', 'contact@chateauroyal.com', 'Email de contact principal'),
('contact_phone', '0644762721', 'Téléphone de contact'),
('owner_name', 'Arnaud Barotteaux', 'Nom du propriétaire'),
('currency', 'EUR', 'Devise utilisée'),
('tax_rate', '20', 'Taux de TVA en pourcentage'),
('booking_advance_days', '1', 'Nombre de jours minimum pour réserver'),
('cancellation_hours', '24', 'Heures avant annulation gratuite');

-- =====================================================
-- COMPTES DE TEST
-- =====================================================

/*
COMPTES DE TEST DISPONIBLES :

ADMIN :
- Email: admin@chateauroyal.com
- Mot de passe: admin123
- Accès: Dashboard admin complet

UTILISATEURS :
- Email: client1@example.com
- Email: client2@example.com  
- Email: client3@example.com
- Mot de passe: password123
- Accès: Réservation de chambres

STATISTIQUES :
- 108 chambres au total
- 8 catégories différentes
- Prix de 260€ à 2800€ par nuit
- Réservations d'exemple incluses
*/

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

SELECT 'Base de données Château Royal créée avec succès !' as message;
SELECT COUNT(*) as total_rooms FROM rooms;
SELECT COUNT(*) as total_categories FROM room_categories;
SELECT COUNT(*) as total_users FROM users;