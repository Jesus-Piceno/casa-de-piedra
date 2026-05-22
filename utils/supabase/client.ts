import { createBrowserClient } from '@supabase/ssr';
import { createClient as createClientJS } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// For backwards compatibility with existing files importing `supabase` directly
export const supabase = createClientJS(supabaseUrl, supabaseAnonKey);
