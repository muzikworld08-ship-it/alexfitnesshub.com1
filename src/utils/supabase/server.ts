import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ilfjiotgkdedgssachoe.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_daJ1e9a4TT8VQyZ1O8ATDg_41zqv60Q";

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
    } catch (e) {
      // Fallback to standard client
    }
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
};
