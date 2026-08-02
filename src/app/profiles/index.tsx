import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/storage";
import AvatarEditor from "@/components/profile/AvatarEditor";
import ProfileForm from "@/components/profile/ProfileForm";

export default function EditProfile() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize fields with current user details
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setUsername(user.username || "");
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  // Image picking handlers
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Error", "Please allow photo library access to change your avatar.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Error", "Please allow camera access to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Profile Picture", "Choose an option to update your photo", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert("Validation Error", "Full Name and Username cannot be empty.");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Validation Error", "Username must be at least 3 characters.");
      return;
    }

    setIsLoading(true);

    try {
      if (!user) {
        throw new Error("User session not found.");
      }

      // Check if username is taken by another user
      const cleanUsername = username.trim().toLowerCase();
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", user.id)
        .maybeSingle();

      if (existingUser) {
        Alert.alert("Username Taken", "This username is already in use. Please select a different one.");
        setIsLoading(false);
        return;
      }

      // Upload profile image if it has changed and is a local file URI
      let finalImageUrl = user.profileImage;
      if (profileImage && profileImage !== user.profileImage) {
        try {
          finalImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          console.error("Error uploading profile image:", error);
          Alert.alert("Upload Failed", "Failed to upload new profile image. Proceeding with details update.");
        }
      }

      // Update in Supabase profiles & auth store
      await updateUser({
        name: fullName.trim(),
        username: cleanUsername,
        profileImage: finalImageUrl,
      });

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      Alert.alert("Save Failed", err?.message || "Failed to update profile details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#2B1A12" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.divider} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Modular Avatar Selector Section */}
          <AvatarEditor profileImage={profileImage} onPress={showImagePicker} />

          {/* Modular Form Fields */}
          <ProfileForm
            fullName={fullName}
            setFullName={setFullName}
            username={username}
            setUsername={setUsername}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.85} onPress={handleSave} disabled={isLoading}>
            <LinearGradient
              colors={["#F97B22", "#F5A623"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Save Changes</Text>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6EC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2B1A12",
  },
  divider: {
    height: 1,
    backgroundColor: "#EED9C7",
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  buttonWrapper: {
    marginTop: "auto",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
