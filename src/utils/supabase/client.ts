import { SupabaseClient } from "@supabase/supabase-js";

/**
 * RETIRED LEGACY SUPABASE CLIENT STUB
 * Supabase has been retired from live application data operations in favor of
 * authoritative Cloud Firestore persistence. This stub preserves exports cleanly
 * without establishing any active client DB connections.
 */
export const isSupabaseConfigured = false;
export const isSupabaseRetired = true;

const createRetiredNoopClient = (): SupabaseClient => {
  const noopResponse = Promise.resolve({ data: null, error: { message: "Supabase retired: Firestore is authoritative." } });
  const chain: any = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") return (resolve: any) => noopResponse.then(resolve);
        return () => chain;
      }
    }
  );
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "from" || prop === "storage" || prop === "channel" || prop === "auth") {
          return () => chain;
        }
        if (prop === "removeChannel") {
          return () => Promise.resolve("ok");
        }
        return () => noopResponse;
      }
    }
  ) as unknown as SupabaseClient;
};

export const createClient = (): SupabaseClient => createRetiredNoopClient();
export const supabase = createRetiredNoopClient();
