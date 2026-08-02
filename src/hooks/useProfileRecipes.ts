import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Recipe, RecipeAuthor } from "./useRecipes";

export function useProfileRecipes() {
  const { user } = useAuthStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileRecipes = useCallback(async (isRefresh = false) => {
    if (!user) return;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("recipes")
        .select(`
          id,
          user_id,
          title,
          description,
          image_url,
          category,
          difficulty,
          steps,
          created_at,
          updated_at,
          profiles (
            name,
            username,
            profile_image_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) {
        throw dbError;
      }

      const typedRecipes = (data || []).map((item: any) => {
        let profilesData: RecipeAuthor | null = null;
        if (item.profiles) {
          if (Array.isArray(item.profiles)) {
            profilesData = item.profiles[0] || null;
          } else {
            profilesData = item.profiles;
          }
        }

        return {
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          category: item.category,
          difficulty: item.difficulty,
          steps: Array.isArray(item.steps) ? item.steps : [],
          created_at: item.created_at,
          updated_at: item.updated_at,
          profiles: profilesData,
        };
      });

      setRecipes(typedRecipes);
    } catch (err: any) {
      console.error("Error fetching profile recipes:", err);
      setError(err?.message || "Failed to fetch your recipes.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileRecipes();
  }, [fetchProfileRecipes]);

  const refresh = () => fetchProfileRecipes(true);

  return { recipes, isLoading, isRefreshing, error, refresh };
}
