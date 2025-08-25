import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  category_id: string;
  beds: number;
  has_view: boolean;
  images: string[];
  description: string;
  amenities: string[];
  price_night: number;
  price_three_days: number;
  price_week: number;
  price_month: number;
  available: boolean;
  total_reservations: number;
  created_at: string;
  updated_at: string;
  room_categories?: {
    name: string;
  };
}

export interface RoomCategory {
  id: string;
  name: string;
  description: string;
  max_occupancy: number;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  duration_type: 'night' | 'threeDays' | 'week' | 'month';
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contact_method: 'email' | 'phone' | 'sms';
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}