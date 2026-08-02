import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRecipes } from "@/hooks/useRecipes";
import Category, { CategoryType } from "@/components/main/Category";
import Card from "@/components/main/Card";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  
  // Custom hook to handle data fetching from Supabase
  const { recipes, isLoading, isRefreshing, error, refresh } = useRecipes(
    selectedCategory === "All" ? null : selectedCategory
  );

  const greeting = user?.name ? `Good morning, ${user.name}` : "Good morning, Chef";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* If error state is present, show it */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#E53935" />
          <Text style={styles.errorText} numberOfLines={2}>
            {error}
          </Text>
        </View>
      )}

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Card recipe={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Logo and Greeting Header */}
            <View style={styles.welcomeSection}>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.subtext}>What are you cooking today?</Text>
            </View>

            {/* Horizontal Categories */}
            <Category
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#F97B22" />
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Ionicons name="receipt-outline" size={48} color="#C9B9AC" />
              <Text style={styles.emptyTitle}>No Recipes Found</Text>
              <Text style={styles.emptySubtitle}>
                {selectedCategory === "All"
                  ? "Be the first to post a delicious recipe!"
                  : `No recipes found under "${selectedCategory}" category.`}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6EC",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEEBEE",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  errorText: {
    color: "#C62828",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingTop: 16,
    marginBottom: 8,
  },
  welcomeSection: {
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2B1A12",
  },
  subtext: {
    fontSize: 15,
    color: "#8A7466",
    marginTop: 4,
  },
  centerContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B1A12",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8A7466",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
