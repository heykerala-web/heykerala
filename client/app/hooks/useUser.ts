"use client";

import { useEffect, useState } from "react";
import { authAPI, tokenManager } from "@/lib/api";

/**
 * @deprecated Use `useAuth` from `context/AuthContext` instead.
 * This hook is retained only for backward compatibility during migration.
 */
export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const token = tokenManager.get();
        if (!token) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const res = await authAPI.getMe(token);
        if (cancelled) return;

        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("useUser: failed to fetch", err);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (when token is set in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        loadUser();
      }
    };

    // Listen for same-tab auth events (dispatched by tokenManager)
    const handleAuthEvent = (_e: Event) => {
      // Small delay to ensure token is saved
      setTimeout(() => {
        loadUser();
      }, 50);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("auth", handleAuthEvent as EventListener);
    }

    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("auth", handleAuthEvent as EventListener);
      }
    };
  }, []);

  return { user, loading, setUser };
}
