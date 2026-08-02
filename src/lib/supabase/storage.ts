import { supabase } from "./client";
import { File } from "expo-file-system";
export const uploadProfileImage = async (userId: string, imageUri: string) => {
  try {
    const fileExtension = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/profile.${fileExtension}`;
    const file = new File(imageUri);
    const bytes = await file.bytes();

    const { error } = await supabase.storage
      .from("profiles")
      .upload(fileName, bytes, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    return `${urlData.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const uploadRecipeImage = async (
  userId: string,
  imageUri: string,
): Promise<string> => {
  try {
    const fileExtension = imageUri.split(".").pop() || "jpg";
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const fileName = `${userId}/${uniqueId}.${fileExtension}`;
    const file = new File(imageUri);
    const bytes = await file.bytes();

    const { error } = await supabase.storage
      .from("recipe")
      .upload(fileName, bytes, {
        contentType: `image/${fileExtension}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("recipe")
      .getPublicUrl(fileName);

    return `${urlData.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error("Error uploading recipe image:", error);
    throw error;
  }
};