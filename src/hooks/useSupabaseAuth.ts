import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useApp } from "../context/AppContext";

export interface SupabaseAuthHookResult {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOutSupabase: () => Promise<void>;
  supabase: typeof supabase;
}

export function useSupabaseAuth(): SupabaseAuthHookResult {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const appContext = useApp();

  useEffect(() => {
    // 1. Retrieve existing session on mount
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      setLoading(false);
    });

    // 2. Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[Supabase Auth] Event: ${event}`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      // Synchronize session with AppContext & Supabase 'profiles' table
      if (currentSession?.user && appContext?.user) {
        try {
          await supabase.from("profiles").upsert({
            id: currentSession.user.id,
            uid: appContext.user.uid || currentSession.user.id,
            email: currentSession.user.email || appContext.user.email,
            display_name: appContext.user.displayName || currentSession.user.user_metadata?.full_name || "User",
            role: appContext.user.role || "user",
            subscription_status: appContext.user.subscriptionStatus || "free",
            subscription_tier: appContext.user.subscriptionTier || "none",
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn("[Supabase Auth] Profile sync notice:", err);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [appContext?.user?.uid]);

  const signOutSupabase = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    user,
    loading,
    signOutSupabase,
    supabase
  };
}

export default useSupabaseAuth;
