import { create } from "zustand";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  profile: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    const data = await api.post<{ token: string; user: User }>("/api/auth/login", {
      email,
      password,
    });
    localStorage.setItem("pantryai_token", data.token);
    localStorage.setItem("pantryai_user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  register: async (email, password, name) => {
    const data = await api.post<{ token: string; user: User }>("/api/auth/register", {
      email,
      password,
      name,
    });
    localStorage.setItem("pantryai_token", data.token);
    localStorage.setItem("pantryai_user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem("pantryai_token");
    localStorage.removeItem("pantryai_user");
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = localStorage.getItem("pantryai_token");
    const userStr = localStorage.getItem("pantryai_user");
    if (token && userStr) {
      set({ user: JSON.parse(userStr), token, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
