"use client";

import { login, logout, refreshToken, refreshUser } from "@/app/functions/api/users";
import { usePathname } from "@/app/i18n/navigation";
import type { User } from "@roo/common";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000; // 2 minuty před vypršením

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenExpRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const scheduleRefresh = useCallback((expSeconds: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const msUntilRefresh = expSeconds * 1000 - Date.now() - REFRESH_BEFORE_EXPIRY_MS;
    if (msUntilRefresh <= 0) return;

    refreshTimerRef.current = setTimeout(async () => {
      const res = await refreshToken();
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
        if (data.exp) scheduleRefresh(data.exp);
      } else {
        setUser(null);
      }
    }, msUntilRefresh);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await refreshUser();
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [refresh]);

  const loginHandler = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const res = await login(email, password);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { error: data?.errors?.[0]?.message ?? "Přihlášení selhalo" };
      }

      const data = await res.json();
      setUser(data.user ?? null);
      if (data.exp) {
        tokenExpRef.current = data.exp;
        scheduleRefresh(data.exp);
      }
      return {};
    },
    [scheduleRefresh],
  );

  const logoutHandler = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    tokenExpRef.current = null;
    await logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginHandler,
        logout: logoutHandler,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
