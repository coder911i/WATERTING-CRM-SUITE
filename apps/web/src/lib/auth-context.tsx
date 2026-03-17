'use client';

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  apiClient, setToken, clearToken, setUser, getUser, getToken,
  type AuthUser,
} from './api-client';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getUser();
    const token = getToken();
    if (storedUser && token) {
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await apiClient.publicPost<LoginResponse>('/auth/login', payload);
    setToken(res.access_token);
    setUser(res.user);
    setUserState(res.user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    clearToken();
    setUserState(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
