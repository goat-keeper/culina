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
    console.log("========== CHECK SESSION ==========");

    set({ isLoading: true });

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("Session:", session);
      console.log("Session Error:", error);

      if (session?.user) {
        const profile = await get().fetchUserProfile(session.user.id);
        console.log("Fetched Profile:", profile);

        set({ user: profile });
      } else {
        console.log("No active session");
        set({ user: null });
      }
    } catch (error) {
      console.error("CHECK SESSION ERROR:", error);
      set({ user: null });
    } finally {
      set({ isLoading: false });
      console.log("==================================");
    }
  },

  fetchUserProfile: async (userId: string) => {
    console.log("========== FETCH PROFILE ==========");
    console.log("User ID:", userId);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Profile Data:", data);
      console.log("Profile Error:", error);

      if (error) {
        return null;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Auth User:", user);

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
      console.error("FETCH PROFILE ERROR:", error);
      return null;
    } finally {
      console.log("==================================");
    }
  },

  signUp: async (email: string, password: string) => {
    console.log("========== SIGN UP ==========");
    console.log("Email:", email);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Signup Data:", data);
      console.log("Signup Error:", error);

      if (error) {
        console.error("SIGNUP FAILED");
        console.error(error);
        throw error;
      }

      if (data.user) {
        console.log("User created:", data.user.id);

        const profile = await get().fetchUserProfile(data.user.id);

        console.log("Fetched profile after signup:", profile);

        set({ user: profile });
      }
    } catch (error) {
      console.error("SIGNUP CATCH:", error);
      throw error;
    } finally {
      console.log("=============================");
    }
  },

  login: async (email: string, password: string) => {
    console.log("========== LOGIN ==========");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login Data:", data);
      console.log("Login Error:", error);

      if (error) {
        console.error("LOGIN FAILED");
        console.error(error);
        throw error;
      }

      if (data.user) {
        console.log("Logged in:", data.user.id);

        const profile = await get().fetchUserProfile(data.user.id);

        console.log("Fetched profile after login:", profile);

        set({ user: profile });
      }
    } catch (error) {
      console.error("LOGIN CATCH:", error);
      throw error;
    } finally {
      console.log("===========================");
    }
  },

  signout: async () => {
    console.log("========== SIGN OUT ==========");

    try {
      const { error } = await supabase.auth.signOut();

      console.log("Signout Error:", error);

      if (error) throw error;

      set({ user: null });
    } catch (error) {
      console.error("SIGNOUT ERROR:", error);
      throw error;
    } finally {
      console.log("==============================");
    }
  },

  updateUser: async (userData: Partial<User>) => {
    console.log("========== UPDATE USER ==========");

    const currentUser = get().user;

    if (!currentUser) {
      console.log("No current user");
      return;
    }

    const updateData: any = {};

    if (userData.name !== undefined)
      updateData.name = userData.name;

    if (userData.username !== undefined)
      updateData.username = userData.username;

    if (userData.profileImage !== undefined)
      updateData.profile_image_url = userData.profileImage;

    if (userData.onboardingCompleted !== undefined)
      updateData.onboarding_completed = userData.onboardingCompleted;

    console.log("Updating:", updateData);

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", currentUser.id);

    console.log("Update Error:", error);

    if (error) throw error;

    set({
      user: {
        ...currentUser,
        ...userData,
      },
    });

    console.log("Update Successful");
    console.log("=================================");
  },
}));