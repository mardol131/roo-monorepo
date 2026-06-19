"use client";

import {
  login,
  logout,
  refreshToken,
  refreshUser,
  requestEmailChange,
  requestPasswordReset,
  switchAccountTypeToCompany,
} from "@/app/functions/api/users";
import { usePathname } from "next/navigation";
import { useRouter } from "@/app/i18n/navigation";
import type { User } from "@roo/common";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000; // 2 minuty před vypršením

const PROTECTED_PREFIXES = ["/company-profile", "/user-profile"];

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Response>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  switchProfileTypeToCompany: () => Promise<void>;
  requestEmailChange: (
    newEmail: string,
    redirectTo?: string,
  ) => Promise<Response | undefined>;
  requestPasswordReset: (
    email: string,
    redirectTo?: string,
  ) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenExpRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  console.log(user);

  useEffect(() => {
    if (isLoading) return;
    if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
      router.replace({
        pathname: "/login-required",
        query: {
          redirectAfterLogin: pathname,
          requireLogin: "true",
          reasonForRequiredLogin: "not_logged_in",
        },
      });
    }
  }, [user, isLoading, pathname, router]);

  const scheduleRefresh = useCallback((expSeconds: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const msUntilRefresh =
      expSeconds * 1000 - Date.now() - REFRESH_BEFORE_EXPIRY_MS;
    if (msUntilRefresh <= 0) return;

    refreshTimerRef.current = setTimeout(async () => {
      const res = await refreshToken();
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
        queryClient.invalidateQueries();
        if (data.exp) scheduleRefresh(data.exp);
      } else {
        setUser(null);
      }
    }, msUntilRefresh);
  }, []);

  const requestEmailChangeHandler = useCallback(
    async (newEmail: string, redirectTo?: string) => {
      if (!user) return;

      const res = await requestEmailChange(newEmail, redirectTo);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message ?? "Změna e-mailu selhala.");
      }

      return res;
    },
    [user],
  );

  const refresh = useCallback(async () => {
    try {
      const res = await refreshUser();
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
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
    async (email: string, password: string): Promise<Response> => {
      const res = await login(email, password);

      const data = await res.json();
      setUser(data.user ?? null);
      queryClient.invalidateQueries();
      if (data.exp) {
        tokenExpRef.current = data.exp;
        scheduleRefresh(data.exp);
      }
      return res;
    },
    [scheduleRefresh],
  );

  const logoutHandler = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    tokenExpRef.current = null;
    await logout();
    setUser(null);
  }, []);

  const switchProfileTypeToCompany = useCallback(async () => {
    await switchAccountTypeToCompany(user?.id ?? "");
    await refresh();
  }, [user, refresh]);

  const requestPasswordResetHandler = useCallback(
    async (email: string, redirectTo?: string) => {
      const res = await requestPasswordReset({ email, redirectTo });
      return res;
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginHandler,
        logout: logoutHandler,
        refresh,
        switchProfileTypeToCompany,
        requestEmailChange: requestEmailChangeHandler,
        requestPasswordReset: requestPasswordResetHandler,
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
