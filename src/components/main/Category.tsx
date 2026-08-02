import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const CATEGORIES = [
  "All",
  "Chicken",
  "Beef",
  "Fish",
  "Vegetable",
  "Dessert",
  "Snack",
  "Drink",
  "Soup",
  "Salad",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

interface CategoryProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export default function Category({
  selectedCategory,
  onSelectCategory,
}: CategoryProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    maxHeight: 50,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EED9C7",
    shadowColor: "#2B1A12",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: "#F97B22",
    borderColor: "#F97B22",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B5447",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
});
