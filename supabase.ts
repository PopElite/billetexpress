import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Event {
  id: string;
  city: string;
  venue: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TicketCategory {
  id: string;
  event_id: string;
  category_name: string;
  price: number;
  available_quantity: number;
  created_at: string;
}

export interface EventWithTickets extends Event {
  ticket_categories: TicketCategory[];
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  ticket_category_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface CartItem {
  ticketId: string;
  eventId: string;
  city: string;
  venue: string;
  date: string;
  categoryName: string;
  price: number;
  quantity: number;
  availableQuantity: number;
}
