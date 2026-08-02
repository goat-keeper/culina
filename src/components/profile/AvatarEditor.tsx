import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AvatarEditorProps {
  profileImage: string | null;
  onPress: () => void;
}

export default function AvatarEditor({
  profileImage,
  onPress,
}: AvatarEditorProps) {
  return (
    <View style={styles.avatarSection}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {profileImage ? (
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={styles.editIconBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          <View style={[styles.avatarWrapper, styles.avatarPlaceholder]}>
            <Ionicons name="camera-outline" size={32} color="#8A7466" />
            <Text style={styles.uploadLabel}>Upload</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    backgroundColor: "#FFF9F2",
    borderWidth: 1.5,
    borderColor: "#EED9C7",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8A7466",
    marginTop: 4,
  },
  editIconBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#F97B22",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
