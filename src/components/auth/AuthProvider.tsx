"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { UserProfile, getUserProfile } from "@/lib/db/userPreferences";
import { useRouter, usePathname } from "next/navigation";
import { logPerf } from "@/lib/utils/timing";
import { clearAllDataCache } from "@/lib/db/cache";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  profileLoading: false,
  isConfigured: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password", "/auth/callback"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const loadUserProfile = async () => {
    setProfileLoading(true);
    const start = performance.now();
    try {
      const p = await getUserProfile();
      setProfile(p);
      logPerf("Profile Loaded in AuthProvider", start);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // 1. Fast, Non-blocking Auth Session Listener
  useEffect(() => {
    const start = performance.now();
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      setLoading(false);
      return;
    }

    // Get initial session synchronously from local cookies/memory
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      setLoading(false);
      logPerf("Initial Session Resolution", start);
    });

    // Synchronous auth listener: updates user and session without blocking on DB queries
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const listenerStart = performance.now();
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
      logPerf("onAuthStateChange Listener Dispatch", listenerStart);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Out-of-band profile fetch (Runs in background, NEVER blocks auth or route navigation)
  useEffect(() => {
    let isMounted = true;

    if (session?.user?.id) {
      setProfileLoading(true);
      getUserProfile()
        .then((p) => {
          if (isMounted) setProfile(p);
        })
        .catch(() => {
          if (isMounted) setProfile(null);
        })
        .finally(() => {
          if (isMounted) setProfileLoading(false);
        });
    } else {
      setProfile(null);
      setProfileLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session?.user]);

  // 3. Client-side route protection guard (depends ONLY on fast auth loading, NOT profile)
  useEffect(() => {
    if (loading) return;

    if (isConfigured) {
      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

      if (!session && !isPublicRoute) {
        router.replace("/login");
      } else if (session && isPublicRoute) {
        router.replace("/");
      }
    }
  }, [loading, session, isConfigured, pathname, router]);

  const signOut = async () => {
    clearAllDataCache();
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        profileLoading,
        isConfigured,
        signOut,
        refreshProfile: loadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
