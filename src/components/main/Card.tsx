import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Recipe } from "@/hooks/useRecipes";

interface CardProps {
  recipe: Recipe;
}

export default function Card({ recipe }: CardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/recipe/[id]" as any,
      params: { id: recipe.id },
    });
  };

  // Safe fallback profile image or standard placeholder
  const avatarUrl = recipe.profiles?.profile_image_url;
  const authorName = recipe.profiles?.name || recipe.profiles?.username || "Unknown Chef";

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      {/* Cover Image & Overlays */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: recipe.image_url }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* Gradient for Text Readability */}
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
          style={styles.gradient}
        >
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle} numberOfLines={2}>
              {recipe.title}
            </Text>
            
            {/* Meta row: Steps & Difficulty */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="flame" size={14} color="#FFF" />
                <Text style={styles.metaText}>{recipe.difficulty}</Text>
              </View>
              <Text style={styles.metaSeparator}>•</Text>
              <View style={styles.metaItem}>
                <Ionicons name="list" size={14} color="#FFF" />
                <Text style={styles.metaText}>
                  {recipe.steps.length} {recipe.steps.length === 1 ? "Step" : "Steps"}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Card Footer: Author Profile & Action */}
      <View style={styles.footer}>
        <View style={styles.authorSection}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={16} color="#A79488" />
            </View>
          )}
          <Text style={styles.authorName} numberOfLines={1}>
            {authorName}
          </Text>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.actionText}>View Recipe</Text>
          <Ionicons name="arrow-forward" size={14} color="#F97B22" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0DFD0",
    shadowColor: "#2B1A12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    height: 240,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    justifyContent: "flex-end",
    padding: 16,
  },
  recipeInfo: {
    gap: 6,
  },
  recipeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  metaSeparator: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EED9C7",
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FBF1E7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EED9C7",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B1A12",
  },
  actionSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: "#F97B22",
    fontSize: 13,
    fontWeight: "700",
  },
});