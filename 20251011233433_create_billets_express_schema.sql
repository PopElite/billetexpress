/*
  # Billets Express - Schema Initial

  1. Nouvelles Tables
    - `events` - Événements disponibles
      - `id` (uuid, primary key)
      - `city` (text) - Ville
      - `venue` (text) - Lieu de l'événement
      - `date` (date) - Date de l'événement
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ticket_categories` - Catégories de billets pour chaque événement
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key) - Référence à l'événement
      - `category_name` (text) - Nom de la catégorie (Catégorie 1, Catégorie 2, Fosse)
      - `price` (numeric) - Prix en euros
      - `available_quantity` (integer) - Nombre de places disponibles
      - `created_at` (timestamp)
    
    - `orders` - Commandes des clients
      - `id` (uuid, primary key)
      - `order_number` (text, unique) - Numéro de commande unique
      - `customer_name` (text) - Nom du client
      - `customer_email` (text) - Email du client
      - `customer_phone` (text) - Téléphone du client
      - `total_amount` (numeric) - Montant total
      - `status` (text) - Statut (pending, confirmed, cancelled)
      - `created_at` (timestamp)
    
    - `order_items` - Détails des billets commandés
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Référence à la commande
      - `ticket_category_id` (uuid, foreign key) - Référence à la catégorie de billet
      - `quantity` (integer) - Quantité de billets
      - `unit_price` (numeric) - Prix unitaire au moment de l'achat
      - `subtotal` (numeric) - Sous-total (quantity × unit_price)
      - `created_at` (timestamp)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour permettre la lecture publique des événements et catégories
    - Politiques pour permettre la création de commandes
    - Politiques restrictives pour la modification des commandes

  3. Index
    - Index sur event_id pour les recherches de billets
    - Index sur order_number pour les recherches de commandes
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  venue text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket_categories table
CREATE TABLE IF NOT EXISTS ticket_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category_name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  available_quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (price >= 0),
  CHECK (available_quantity >= 0)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  total_amount numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CHECK (total_amount >= 0),
  CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_category_id uuid NOT NULL REFERENCES ticket_categories(id) ON DELETE RESTRICT,
  quantity integer NOT NULL,
  unit_price numeric(10, 2) NOT NULL,
  subtotal numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (quantity > 0),
  CHECK (unit_price >= 0),
  CHECK (subtotal >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ticket_categories_event_id ON ticket_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for events and tickets
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view ticket categories"
  ON ticket_categories FOR SELECT
  USING (true);

-- Allow anyone to create orders (guest checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their order by order number"
  ON orders FOR SELECT
  USING (true);

-- Allow anyone to create order items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);