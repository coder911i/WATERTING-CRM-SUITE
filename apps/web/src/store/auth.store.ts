import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ user, accessToken: token });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },
}));
