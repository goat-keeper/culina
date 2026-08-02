import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProfileHeaderProps {
  name: string | null;
  username: string | null;
  profileImage: string | null;
}

export default function ProfileHeader({
  name,
  username,
  profileImage,
}: ProfileHeaderProps) {
  const usernameText = username ? `@${username}` : "@username";
  const fullNameText = name || "Anonymous Chef";

  return (
    <View style={styles.profileSection}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={48} color="#A79488" />
        </View>
      )}

      <Text style={styles.fullName}>{fullNameText}</Text>
      <Text style={styles.username}>{usernameText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#2B1A12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFF9F2",
    borderWidth: 2,
    borderColor: "#EED9C7",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  fullName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2B1A12",
  },
  username: {
    fontSize: 14,
    color: "#8A7466",
    fontWeight: "600",
  },
});
