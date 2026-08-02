import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRecipeDetail } from "@/hooks/useRecipeDetail";

const { width } = Dimensions.get("window");

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { recipe, isLoading, error } = useRecipeDetail(id);

  // Go back handler
  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97B22" />
        <Text style={styles.loadingText}>Loading recipe details...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#E53935" />
        <Text style={styles.errorTitle}>Error Loading Recipe</Text>
        <Text style={styles.errorSubtitle}>{error || "Recipe not found."}</Text>
        <TouchableOpacity style={styles.backBtnAction} onPress={handleBack}>
          <Text style={styles.backBtnActionText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate total cooking time by summing step timers
  const totalTime = recipe.steps.reduce((sum, step) => sum + (step.timer || 0), 0);

  // Config for difficulty icon
  const getDifficultyConfig = (diff: string) => {
    switch (diff) {
      case "Easy":
        return { icon: "leaf-outline" as const, color: "#4CAF50" };
      case "Hard":
        return { icon: "flash-outline" as const, color: "#E53935" };
      default:
        return { icon: "flame-outline" as const, color: "#F5A623" };
    }
  };

  const difficultyConfig = getDifficultyConfig(recipe.difficulty);
  const authorName = recipe.profiles?.name || recipe.profiles?.username || "Unknown Chef";
  const avatarUrl = recipe.profiles?.profile_image_url;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover Photo Header */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: recipe.image_url }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          >
            {/* Header Overlays */}
            <SafeAreaView style={styles.headerBar} edges={["top"]}>
              <TouchableOpacity style={styles.backBtnCircle} onPress={handleBack} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={22} color="#2B1A12" />
              </TouchableOpacity>
              {/* Bookmark button is removed */}
              <View />
            </SafeAreaView>

            {/* Title & Description overlaid at bottom of image */}
            <View style={styles.titleWrapper}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
              </View>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              {recipe.description && (
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Recipe Body Info */}
        <View style={styles.body}>
          {/* Key Parameters Cards / Pills Row */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#F97B22" />
              <Text style={styles.statVal}>{totalTime > 0 ? `${totalTime} Min` : "—"}</Text>
              <Text style={styles.statLabel}>Prep Time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name={difficultyConfig.icon} size={20} color={difficultyConfig.color} />
              <Text style={styles.statVal}>{recipe.difficulty}</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="list-outline" size={20} color="#F97B22" />
              <Text style={styles.statVal}>{recipe.steps.length}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="restaurant-outline" size={20} color="#F97B22" />
              <Text style={styles.statVal} numberOfLines={1}>{recipe.category}</Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>

          {/* Author Row */}
          <View style={styles.authorRow}>
            <View style={styles.authorInfo}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.authorAvatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={20} color="#A79488" />
                </View>
              )}
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>{authorName}</Text>
                <Text style={styles.authorRole}>Recipe Creator</Text>
              </View>
            </View>
            {/* Follow button is removed */}
          </View>

          {/* Instructions Header */}
          <Text style={styles.sectionHeader}>Instructions</Text>

          {/* Steps List */}
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{step.step}</Text>
                </View>
                <Text style={styles.stepTitle}>Step {step.step}</Text>
                {step.timer && (
                  <View style={styles.stepTimerTag}>
                    <Ionicons name="timer-outline" size={12} color="#F97B22" />
                    <Text style={styles.stepTimerTagText}>{step.timer} min</Text>
                  </View>
                )}
              </View>

              <Text style={styles.stepInstruction}>{step.instruction}</Text>

              {/* Optional Tip Banner */}
              {step.tip && (
                <View style={styles.tipBox}>
                  <Ionicons name="bulb" size={16} color="#F5A623" />
                  <Text style={styles.tipText}>
                    <Text style={styles.tipLabel}>Tip: </Text>
                    {step.tip}
                  </Text>
                </View>
              )}
            </View>
          ))}
          
          {/* Padding bottom */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6EC",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF6EC",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#8A7466",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF6EC",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2B1A12",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#8A7466",
    textAlign: "center",
    marginBottom: 24,
  },
  backBtnAction: {
    backgroundColor: "#F97B22",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backBtnActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageWrapper: {
    height: width * 1.1,
    width: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backBtnCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleWrapper: {
    padding: 20,
    gap: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F97B22",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  recipeTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#F0DFD0",
    shadowColor: "#2B1A12",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2B1A12",
  },
  statLabel: {
    fontSize: 11,
    color: "#8A7466",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#F0DFD0",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF9F2",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0DFD0",
    marginBottom: 24,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#EED9C7",
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FBF1E7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#EED9C7",
  },
  authorMeta: {
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2B1A12",
  },
  authorRole: {
    fontSize: 12,
    color: "#8A7466",
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2B1A12",
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0DFD0",
    marginBottom: 16,
    gap: 12,
    shadowColor: "#2B1A12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F97B22",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2B1A12",
    flex: 1,
  },
  stepTimerTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF2E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#FFD8BF",
  },
  stepTimerTagText: {
    color: "#F97B22",
    fontSize: 12,
    fontWeight: "700",
  },
  stepInstruction: {
    fontSize: 14,
    color: "#4A3B32",
    lineHeight: 22,
  },
  tipBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFFDF0",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFF2C2",
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#66521A",
    lineHeight: 18,
  },
  tipLabel: {
    fontWeight: "800",
  },
});
