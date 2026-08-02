import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  Easy: { icon: "leaf-outline", color: "#4CAF50" },
  Medium: { icon: "flame-outline", color: "#F5A623" },
  Hard: { icon: "flash-outline", color: "#E53935" },
};

interface DifficultyPickerProps {
  selected: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
}

export default function DifficultyPicker({
  selected,
  onSelect,
}: DifficultyPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((difficulty) => {
          const isActive = selected === difficulty;
          const config = DIFFICULTY_CONFIG[difficulty];
          return (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.chip,
                isActive && { backgroundColor: config.color, borderColor: config.color },
              ]}
              onPress={() => onSelect(difficulty)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={config.icon}
                size={16}
                color={isActive ? "#FFFFFF" : config.color}
              />
              <Text
                style={[
                  styles.chipText,
                  isActive && styles.chipTextActive,
                ]}
              >
                {difficulty}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B1A12",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FBF1E7",
    borderWidth: 1,
    borderColor: "#EED9C7",
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
