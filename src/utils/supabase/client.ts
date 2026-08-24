import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

// Retrieve configuration safely across browser, Vite, and server environments
const rawUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof window !== "undefined" && (window as any)?.__ENV?.NEXT_PUBLIC_SUPABASE_URL) ||
  "";

const rawKey =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof window !== "undefined" && (window as any)?.__ENV?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  "";

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
);

// Fallback placeholder endpoints to prevent Supabase constructor throw when env vars are unpopulated
const supabaseUrl = isSupabaseConfigured ? rawUrl : "https://placeholder-project.supabase.co";
const supabaseKey = isSupabaseConfigured ? rawKey : "placeholder-public-key";

export const createClient = (): SupabaseClient => {
  try {
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch {
    return createSupabaseClient(supabaseUrl, supabaseKey);
  }
};

export const supabase = createClient();

