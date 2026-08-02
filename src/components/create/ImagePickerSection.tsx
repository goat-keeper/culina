import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ImagePickerSectionProps {
  imageUri: string | null;
  onPickImage: () => void;
}

export default function ImagePickerSection({
  imageUri,
  onPickImage,
}: ImagePickerSectionProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPickImage}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <View style={styles.changeOverlay}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.changeText}>Change Photo</Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera-outline" size={40} color="#F97B22" />
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={12} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.title}>Add Cover Photo</Text>
          <Text style={styles.subtitle}>High-quality, landscape preferred</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E8C9AD",
    borderStyle: "dashed",
    backgroundColor: "#FBF0E4",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 12,
  },
  plusBadge: {
    position: "absolute",
    top: -2,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F97B22",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B1A12",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#9C8478",
  },
  previewWrapper: {
    position: "relative",
    height: 200,
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  changeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
