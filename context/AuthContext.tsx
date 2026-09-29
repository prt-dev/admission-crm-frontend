"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  AuthContextType,
  AuthUser,
  LoginCredentials,
  RegisterUser,
} from "@/types/auth";
import { authLocalClientService as authLocalService } from "@/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize user state on mount
  useEffect(() => {
    const currentUser = authLocalService.getUser();
    setUser(currentUser);
    setIsLoading(false);

    // Subscribe to internal auth service events
    const unsubscribe = authLocalService.subscribe((updatedUser: AuthUser | null) => {
      setUser(updatedUser);
    });

    // Also listen to cross-tab storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === authLocalService.STORAGE_KEY_USER) {
        const freshUser = authLocalService.getUser();
        setUser(freshUser);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const res = await authLocalService.login(credentials);
        if (res.success && res.user) {
          setUser(res.user);
          return { success: true, user: res.user };
        }
        return { success: false, error: res.error || "Login failed" };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (data: RegisterUser) => {
      setIsLoading(true);
      try {
        const res = await authLocalService.register(data);
        if (res.success && res.user) {
          setUser(res.user);
          return { success: true, user: res.user };
        }
        return { success: false, error: res.error || "Registration failed" };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authLocalService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    const updated = authLocalService.updateCurrentUser(data);
    if (updated) {
      setUser(updated);
    }
  }, []);

  const switchRole = useCallback((role: string) => {
    const updated = authLocalService.switchRole(role);
    if (updated) {
      setUser(updated);
    }
  }, []);

  const checkAuth = useCallback(() => {
    return authLocalService.isAuthenticated();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      updateUser,
      switchRole,
      checkAuth,
    }),
    [user, isLoading, login, register, logout, updateUser, switchRole, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
export default AuthContext;
