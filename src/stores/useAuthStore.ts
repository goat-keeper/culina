import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  profileImage: string | null;
  onboardingCompleted: boolean;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;

  checkSession: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<User | null>;

  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;

  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,

  checkSession: async () => {
    set({ isLoading: true });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await get().fetchUserProfile(session.user.id);
        set({ user: profile });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error(error);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
        return null;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      return {
        id: data.id,
        email: user.email ?? "",
        name: data.name,
        username: data.username,
        profileImage: data.profile_image_url,
        onboardingCompleted: data.onboarding_completed,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      const profile = await get().fetchUserProfile(data.user.id);
      set({ user: profile });
    }
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      const profile = await get().fetchUserProfile(data.user.id);
      set({ user: profile });
    }
  },

  signout: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);

    set({ user: null });
  },

  updateUser: async (userData: Partial<User>) => {
    const currentUser = get().user;

    if (!currentUser) return;

    const updateData: any = {};

    if (userData.name !== undefined)
      updateData.name = userData.name;

    if (userData.username !== undefined)
      updateData.username = userData.username;

    if (userData.profileImage !== undefined)
      updateData.profile_image_url = userData.profileImage;

    if (userData.onboardingCompleted !== undefined)
      updateData.onboarding_completed = userData.onboardingCompleted;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", currentUser.id);

    if (error) throw error;

    set({
      user: {
        ...currentUser,
        ...userData,
      },
    });
  },
}));