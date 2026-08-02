import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

export interface RecipeAuthor {
  name: string | null;
  username: string | null;
  profile_image_url: string | null;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  timer?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  difficulty: string;
  steps: RecipeStep[];
  created_at: string;
  updated_at: string;
  profiles: RecipeAuthor | null;
}

export function useRecipes(category: string | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      let query = supabase
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
        .order("created_at", { ascending: false });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      const { data, error: dbError } = await query;

      if (dbError) {
        throw dbError;
      }

      // Handle type casting carefully
      const typedRecipes = (data || []).map((item: any) => {
        // Handle profiles if nested/array/object
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
      console.error("Error fetching recipes:", err);
      setError(err?.message || "Something went wrong while fetching recipes.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [category]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const refresh = () => fetchRecipes(true);

  return { recipes, isLoading, isRefreshing, error, refresh };
}
