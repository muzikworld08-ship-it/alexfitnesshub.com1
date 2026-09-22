import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : "https://placeholder-project.supabase.co";
const supabaseKey = isSupabaseConfigured ? rawKey : "placeholder-public-key";

export const createClient = (cookieStore?: any) => {
  if (cookieStore) {
    try {
      return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return typeof cookieStore.getAll === "function" ? cookieStore.getAll() : [];
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                if (typeof cookieStore.set === "function") {
                  cookieStore.set(name, value, options);
                }
              });
            } catch {
              // Server component write fallback
            }
          }
        }
      });
    } catch {
      // Fallback to standard client
    }
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

