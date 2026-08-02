import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Recipe, RecipeAuthor } from "./useRecipes";

export function useRecipeDetail(id: string | string[] | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
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
        .eq("id", Array.isArray(id) ? id[0] : id)
        .single();

      if (dbError) {
        throw dbError;
      }

      if (data) {
        let profilesData: RecipeAuthor | null = null;
        if (data.profiles) {
          if (Array.isArray(data.profiles)) {
            profilesData = data.profiles[0] || null;
          } else {
            profilesData = data.profiles as any;
          }
        }

        const typedRecipe: Recipe = {
          id: data.id,
          user_id: data.user_id,
          title: data.title,
          description: data.description,
          image_url: data.image_url,
          category: data.category,
          difficulty: data.difficulty,
          steps: Array.isArray(data.steps) ? (data.steps as any) : [],
          created_at: data.created_at,
          updated_at: data.updated_at,
          profiles: profilesData,
        };

        setRecipe(typedRecipe);
      } else {
        setError("Recipe not found.");
      }
    } catch (err: any) {
      console.error("Error fetching recipe detail:", err);
      setError(err?.message || "Failed to fetch recipe details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return { recipe, isLoading, error, refetch: fetchRecipe };
}
