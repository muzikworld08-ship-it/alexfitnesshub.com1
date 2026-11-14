import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export interface RetiredSupabaseAuthResult {
  session: null;
  user: null;
  loading: boolean;
  signOutSupabase: () => Promise<void>;
  supabase: null;
}

/**
 * Retired legacy Supabase Auth compatibility hook.
 * Authentication is managed authoritatively via Firebase Auth in AppContext.
 */
export function useSupabaseAuth(): RetiredSupabaseAuthResult {
  const { user, loading, logout } = useApp();

  return useMemo(
    () => ({
      session: null,
      user: null,
      loading: Boolean(loading && !user),
      signOutSupabase: async () => {
        await logout();
      },
      supabase: null
    }),
    [loading, user, logout]
  );
}

export default useSupabaseAuth;
