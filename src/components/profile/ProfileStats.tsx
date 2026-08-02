import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProfileStatsProps {
  count: number;
}

export default function ProfileStats({ count }: ProfileStatsProps) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Ionicons name="restaurant-outline" size={24} color="#F97B22" />
        <Text style={styles.statVal}>{count}</Text>
        <Text style={styles.statLabel}>Recipes Contributed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#F0DFD0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2B1A12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statVal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2B1A12",
  },
  statLabel: {
    fontSize: 12,
    color: "#8A7466",
    fontWeight: "700",
  },
});
