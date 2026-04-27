"use client";

import { login, logout, refreshUser } from "@/app/functions/api/users";
import type { User } from "@roo/common";
import { ca } from "date-fns/locale";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

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

  console.log("AuthProvider render", { user, isLoading });

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
      return {};
    },
    [],
  );

  const logoutHandler = useCallback(async () => {
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
