/*
# Ajout du système de menu et CGV

1. Nouvelles Tables
- `menu_categories` (catégories de menu: petit-déjeuner, déjeuner, dîner)
- `menu_items` (plats et boissons avec prix)
- `legal_pages` (pages CGV, mentions légales, etc.)

2. Sécurité
- Enable RLS sur toutes les nouvelles tables
- Politiques d'accès pour admin et lecture publique

3. Données par défaut
- 5 petits-déjeuners
- 10 déjeuners + boissons
- 10 dîners + boissons
- Page CGV
*/

-- Table des catégories de menu
CREATE TABLE IF NOT EXISTS menu_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    name text NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table des éléments de menu
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  ingredients text[],
  allergens text[],
  is_vegetarian boolean DEFAULT false,
  is_vegan boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  available boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des pages légales
CREATE TABLE IF NOT EXISTS legal_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    meta_description text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insertion des catégories de menu
INSERT INTO
    menu_categories (
        name,
        description,
        display_order
    )
VALUES (
        'Petit-déjeuner',
        'Nos délicieux petits-déjeuners servis de 7h à 11h',
        1
    ),
    (
        'Déjeuner',
        'Menu déjeuner disponible de 12h à 15h',
        2
    ),
    (
        'Dîner',
        'Menu gastronomique servi de 19h à 23h',
        3
    ),
    (
        'Boissons',
        'Sélection de boissons chaudes et froides',
        4
    );

-- Insertion des petits-déjeuners (5 items)
INSERT INTO menu_items (category_id, name, description, price, image_url, ingredients, is_vegetarian, display_order) VALUES
(
  (SELECT id FROM menu_categories WHERE name = 'Petit-déjeuner'),
  'Petit-déjeuner Continental Royal',
  'Croissants frais, pain de mie grillé, confitures maison, beurre fermier, café ou thé',
  28.00,
  'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Croissants', 'Pain de mie', 'Confitures', 'Beurre', 'Café', 'Thé'],
  true,
  1
),
(
  (SELECT id FROM menu_categories WHERE name = 'Petit-déjeuner'),
  'Petit-déjeuner Anglais Complet',
  'Œufs brouillés, bacon grillé, saucisses, haricots blancs, champignons, tomates grillées',
  35.00,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Œufs', 'Bacon', 'Saucisses', 'Haricots', 'Champignons', 'Tomates'],
  false,
  2
),
(
  (SELECT id FROM menu_categories WHERE name = 'Petit-déjeuner'),
  'Bowl Healthy du Château',
  'Granola maison, yaourt grec, fruits frais de saison, miel de lavande, graines de chia',
  24.00,
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Granola', 'Yaourt grec', 'Fruits frais', 'Miel', 'Graines de chia'],
  true,
  3
),
(
  (SELECT id FROM menu_categories WHERE name = 'Petit-déjeuner'),
  'Pancakes aux Myrtilles',
  'Stack de pancakes moelleux, myrtilles fraîches, sirop d''érable, chantilly maison',
  22.00,
  'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Pancakes', 'Myrtilles', 'Sirop d''érable', 'Chantilly'],
  true,
  4
),
(
  (SELECT id FROM menu_categories WHERE name = 'Petit-déjeuner'),
  'Avocado Toast Gourmet',
  'Pain complet grillé, avocat écrasé, œuf poché, graines de sésame, pousses d''épinards',
  26.00,
  'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Pain complet', 'Avocat', 'Œuf poché', 'Graines de sésame', 'Épinards'],
  true,
  5
);

-- Insertion des déjeuners (10 items)
INSERT INTO menu_items (category_id, name, description, price, image_url, ingredients, is_vegetarian, display_order) VALUES
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Salade César Royale',
  'Salade romaine, poulet grillé, parmesan, croûtons maison, sauce César traditionnelle',
  28.00,
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Salade romaine', 'Poulet', 'Parmesan', 'Croûtons', 'Sauce César'],
  false,
  1
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Risotto aux Champignons',
  'Risotto crémeux aux cèpes et champignons de Paris, parmesan vieilli, truffe noire',
  32.00,
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Riz arborio', 'Cèpes', 'Champignons', 'Parmesan', 'Truffe'],
  true,
  2
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Saumon Grillé aux Herbes',
  'Filet de saumon grillé, légumes de saison, sauce hollandaise, pommes de terre nouvelles',
  38.00,
  'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Saumon', 'Légumes de saison', 'Sauce hollandaise', 'Pommes de terre'],
  false,
  3
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Burger Gourmet du Château',
  'Pain brioche, bœuf Angus, fromage de chèvre, roquette, tomates confites, frites maison',
  26.00,
  'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Pain brioche', 'Bœuf Angus', 'Chèvre', 'Roquette', 'Tomates', 'Frites'],
  false,
  4
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Quiche Lorraine Traditionnelle',
  'Pâte brisée maison, lardons fumés, œufs fermiers, crème fraîche, salade verte',
  22.00,
  'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Pâte brisée', 'Lardons', 'Œufs', 'Crème fraîche', 'Salade'],
  false,
  5
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Pasta Carbonara Authentique',
  'Spaghetti, pancetta croustillante, œufs, parmesan, poivre noir, persil frais',
  24.00,
  'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Spaghetti', 'Pancetta', 'Œufs', 'Parmesan', 'Poivre', 'Persil'],
  false,
  6
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Tartare de Bœuf',
  'Bœuf haché au couteau, câpres, cornichons, échalotes, œuf de caille, frites',
  34.00,
  'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Bœuf', 'Câpres', 'Cornichons', 'Échalotes', 'Œuf de caille', 'Frites'],
  false,
  7
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Ratatouille Provençale',
  'Légumes du soleil mijotés, herbes de Provence, huile d\'olive, pain de campagne',
  20.00,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Courgettes', 'Aubergines', 'Tomates', 'Poivrons', 'Herbes de Provence'],
  true,
  8
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Fish & Chips Maison',
  'Cabillaud pané, frites épaisses, sauce tartare, petits pois à la menthe',
  28.00,
  'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Cabillaud', 'Frites', 'Sauce tartare', 'Petits pois', 'Menthe'],
  false,
  9
),
(
  (SELECT id FROM menu_categories WHERE name = 'Déjeuner'),
  'Salade de Chèvre Chaud',
  'Mesclun, crottin de chèvre grillé, noix, miel, vinaigrette balsamique',
  24.00,
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Mesclun', 'Crottin de chèvre', 'Noix', 'Miel', 'Vinaigre balsamique'],
  true,
  10
);

-- Insertion des dîners (10 items)
INSERT INTO menu_items (category_id, name, description, price, image_url, ingredients, is_vegetarian, display_order) VALUES
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Homard Thermidor',
  'Homard gratiné à la crème, cognac, parmesan, légumes fins, pommes duchesse',
  85.00,
  'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Homard', 'Crème', 'Cognac', 'Parmesan', 'Légumes fins'],
  false,
  1
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Côte de Bœuf Angus',
  'Côte de bœuf maturée 28 jours, jus au thym, gratin dauphinois, haricots verts',
  68.00,
  'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Côte de bœuf', 'Thym', 'Pommes de terre', 'Haricots verts'],
  false,
  2
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Magret de Canard aux Cerises',
  'Magret de canard rosé, sauce aux cerises, purée de céleri, légumes glacés',
  45.00,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Magret de canard', 'Cerises', 'Céleri', 'Légumes glacés'],
  false,
  3
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Loup de Mer en Croûte',
  'Loup de mer en croûte d''herbes, beurre blanc, légumes primeurs, riz pilaf',
  52.00,
  'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Loup de mer', 'Herbes', 'Beurre blanc', 'Légumes primeurs', 'Riz'],
  false,
  4
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Carré d\'Agneau aux Herbes',
  'Carré d\'agneau rosé, croûte d\'herbes, ratatouille, jus d\'agneau',
  58.00,
  'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Carré d\'agneau', 'Herbes', 'Ratatouille', 'Jus d\'agneau'],
  false,
  5
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Risotto aux Truffes Noires',
  'Risotto crémeux, truffes noires du Périgord, parmesan vieilli, roquette',
  48.00,
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Riz arborio', 'Truffes noires', 'Parmesan', 'Roquette'],
  true,
  6
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Sole Meunière Classique',
  'Sole entière meunière, beurre noisette, citron, pommes vapeur, épinards',
  42.00,
  'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Sole', 'Beurre noisette', 'Citron', 'Pommes de terre', 'Épinards'],
  false,
  7
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Pigeon aux Figues',
  'Pigeon rôti, sauce aux figues, purée de marrons, choux de Bruxelles',
  55.00,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Pigeon', 'Figues', 'Marrons', 'Choux de Bruxelles'],
  false,
  8
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Turbot aux Champignons',
  'Filet de turbot, fricassée de champignons, beurre blanc, légumes fins',
  48.00,
  'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Turbot', 'Champignons', 'Beurre blanc', 'Légumes fins'],
  false,
  9
),
(
  (SELECT id FROM menu_categories WHERE name = 'Dîner'),
  'Légumes du Potager Royal',
  'Assortiment de légumes bio du potager, quinoa, graines, vinaigrette aux herbes',
  32.00,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Légumes bio', 'Quinoa', 'Graines', 'Herbes fraîches'],
  true,
  10
);

-- Insertion des boissons (10 items)
INSERT INTO menu_items (category_id, name, description, price, image_url, ingredients, is_vegetarian, display_order) VALUES
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Café Expresso Royal',
  'Café expresso italien, grains torréfiés artisanalement',
  4.50,
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Café expresso'],
  true,
  1
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Thé Earl Grey Premium',
  'Thé noir bergamote, service à l''anglaise avec lait et sucre',
  6.00,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Thé Earl Grey', 'Bergamote'],
  true,
  2
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Jus d''Orange Pressé',
  'Oranges fraîches pressées à la commande',
  8.00,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Oranges fraîches'],
  true,
  3
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Smoothie Fruits Rouges',
  'Fraises, framboises, myrtilles, yaourt grec, miel',
  12.00,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Fraises', 'Framboises', 'Myrtilles', 'Yaourt grec', 'Miel'],
  true,
  4
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Limonade Artisanale',
  'Citrons frais, eau pétillante, menthe, sirop de canne',
  7.00,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Citrons', 'Eau pétillante', 'Menthe', 'Sirop de canne'],
  true,
  5
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Chocolat Chaud Viennois',
  'Chocolat noir 70%, chantilly maison, copeaux de chocolat',
  9.00,
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Chocolat noir', 'Chantilly', 'Copeaux chocolat'],
  true,
  6
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Infusion Verveine Menthe',
  'Verveine fraîche, menthe du jardin, miel de lavande',
  5.50,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Verveine', 'Menthe', 'Miel de lavande'],
  true,
  7
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Eau Pétillante Artisanale',
  'Eau de source gazéifiée, aromatisée citron ou concombre',
  4.00,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Eau de source', 'Citron ou concombre'],
  true,
  8
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Mocktail Royal',
  'Jus de cranberry, limonade, menthe fraîche, fruits rouges',
  11.00,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Cranberry', 'Limonade', 'Menthe', 'Fruits rouges'],
  true,
  9
),
(
  (SELECT id FROM menu_categories WHERE name = 'Boissons'),
  'Kombucha Maison',
  'Thé fermenté, gingembre et citron vert, probiotiques naturels',
  8.50,
  'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Thé fermenté', 'Gingembre', 'Citron vert'],
  true,
  10
);

-- Insertion de la page CGV
INSERT INTO
    legal_pages (
        slug,
        title,
        content,
        meta_description
    )
VALUES (
        'cgv',
        'Conditions Générales de Vente',
        '# Conditions Générales de Vente - Château Royal

## Article 1 - Objet et champ d''application

Les présentes Conditions Générales de Vente (CGV) s''appliquent à toutes les prestations de services proposées par le Château Royal, établissement hôtelier de luxe situé en France.

## Article 2 - Réservations

### 2.1 Modalités de réservation
Les réservations peuvent être effectuées :
- En ligne via notre site internet
- Par téléphone au 06 44 76 27 21
- Par email à contact@chateauroyal.com

### 2.2 Confirmation de réservation
Toute réservation est confirmée par l''envoi d''un email de confirmation contenant :
- Les dates de séjour
- Le type de chambre réservée
- Le montant total
- Les conditions d''annulation

## Article 3 - Tarifs et paiement

### 3.1 Tarifs
Les tarifs sont exprimés en euros TTC et peuvent varier selon :
- La saison
- La durée du séjour
- Le type de chambre
- Les services additionnels

### 3.2 Modalités de paiement
Le paiement s''effectue :
- Par carte bancaire (Visa, Mastercard, American Express)
- Par virement bancaire
- En espèces (dans la limite légale)

### 3.3 Facturation
Un acompte de 30% est demandé à la réservation.
Le solde est réglé à l''arrivée ou au départ selon les modalités convenues.

## Article 4 - Annulation et modification

### 4.1 Annulation par le client
- Annulation gratuite jusqu''à 48h avant l''arrivée
- Entre 48h et 24h : 50% du montant total
- Moins de 24h : 100% du montant total

### 4.2 Modification de réservation
Les modifications sont possibles sous réserve de disponibilité et peuvent entraîner un supplément.

## Article 5 - Arrivée et départ

### 5.1 Horaires
- Arrivée : à partir de 15h00
- Départ : avant 12h00

### 5.2 Retard
En cas de retard, merci de nous prévenir.
Les chambres sont maintenues jusqu''à 20h00 sauf avis contraire.

## Article 6 - Services et équipements

### 6.1 Services inclus
- Accès WiFi gratuit
- Service de conciergerie
- Accès aux espaces communs
- Service de voiturier

### 6.2 Services payants
- Spa et wellness
- Restaurant et room service
- Blanchisserie
- Excursions et activités

## Article 7 - Responsabilité

### 7.1 Responsabilité de l''établissement
Le Château Royal s''engage à fournir des prestations conformes aux standards de l''hôtellerie de luxe.

### 7.2 Responsabilité du client
Le client s''engage à :
- Respecter le règlement intérieur
- Utiliser les équipements avec précaution
- Signaler tout dommage

## Article 8 - Réclamations

Toute réclamation doit être formulée :
- Sur place auprès de la réception
- Par écrit dans les 8 jours suivant le départ
- À l''adresse : contact@chateauroyal.com

## Article 9 - Protection des données

Conformément au RGPD, vos données personnelles sont collectées et traitées pour :
- La gestion de votre réservation
- L''amélioration de nos services
- L''envoi d''offres promotionnelles (avec votre accord)

## Article 10 - Droit applicable

Les présentes CGV sont soumises au droit français.
Tout litige sera de la compétence des tribunaux français.

## Article 11 - Contact

**Château Royal**
Propriétaire : Arnaud Barotteaux
Téléphone : 06 44 76 27 21
Email : contact@chateauroyal.com

---

*Dernière mise à jour : Décembre 2024*',
        'Conditions générales de vente du Château Royal - Hôtel de luxe en France'
    );

-- Enable Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les catégories de menu
CREATE POLICY "Anyone can read menu categories" ON menu_categories FOR
SELECT TO authenticated USING (active = true);

CREATE POLICY "Only admins can modify menu categories" ON menu_categories FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.is_admin = true
    )
);

-- Politiques RLS pour les éléments de menu
CREATE POLICY "Anyone can read menu items" ON menu_items FOR
SELECT TO authenticated USING (available = true);

CREATE POLICY "Only admins can modify menu items" ON menu_items FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.is_admin = true
    )
);

-- Politiques RLS pour les pages légales
CREATE POLICY "Anyone can read legal pages" ON legal_pages FOR
SELECT TO authenticated USING (active = true);

CREATE POLICY "Only admins can modify legal pages" ON legal_pages FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.is_admin = true
    )
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_menu_categories_active ON menu_categories (active);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (available);

CREATE INDEX IF NOT EXISTS idx_legal_pages_slug ON legal_pages (slug);

CREATE INDEX IF NOT EXISTS idx_legal_pages_active ON legal_pages (active);

-- Message de confirmation
SELECT 'Système de menu et pages légales créés avec succès!' as message;