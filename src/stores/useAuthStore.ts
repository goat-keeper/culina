import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

interface AuthStore {
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loading: false,

  signUp: async (email: string, password: string) => {
    // set({ loading: true });

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);
  },

  login: async (email: string, password: string) => {

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw new Error(error.message);
    } finally {
    }
  },

  signout: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(error.message);
  },
  
}));