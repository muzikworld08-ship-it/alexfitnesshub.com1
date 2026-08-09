import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL || "https://ilfjiotgkdedgssachoe.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_daJ1e9a4TT8VQyZ1O8ATDg_41zqv60Q";

export const createClient = () => {
  try {
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (e) {
    return createSupabaseClient(supabaseUrl, supabaseKey);
  }
};

export const supabase = createClient();
