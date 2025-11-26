import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TopService {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: string | null;
  image_url: string;
  cta_text: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getTopServices(categoryId: string | null = null) {
  const query = supabase
    .from('top_services')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (categoryId === null) {
    query.is('category_id', null);
  } else {
    query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching top services:', error);
    return [];
  }

  return data as TopService[];
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data as ServiceCategory | null;
}
