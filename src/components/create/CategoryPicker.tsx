import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const CATEGORIES = [
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

export type Category = (typeof CATEGORIES)[number];

interface CategoryPickerProps {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

export default function CategoryPicker({
  selected,
  onSelect,
}: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isActive = selected === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(category)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B1A12",
    marginBottom: 10,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#FBF1E7",
    borderWidth: 1,
    borderColor: "#EED9C7",
  },
  chipActive: {
    backgroundColor: "#F97B22",
    borderColor: "#F97B22",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B5447",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
});
