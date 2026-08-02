import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { supabase } from "@/lib/supabase/client";
import { uploadRecipeImage } from "@/lib/supabase/storage";
import { useAuthStore } from "@/stores/useAuthStore";

import ImagePickerSection from "@/components/create/ImagePickerSection";
import FormInput from "@/components/create/FormInput";
import CategoryPicker, {
  type Category,
} from "@/components/create/CategoryPicker";
import DifficultyPicker, {
  type Difficulty,
} from "@/components/create/DifficultyPicker";
import StepEditor, { type Step } from "@/components/create/StepEditor";

export default function Create() {
  const { user } = useAuthStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    { step: 1, instruction: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Image picking (same pattern as onboarding) ──────────────
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Please give media permissions");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera permissions to take a photo.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select cover photo", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // ── Reset form ──────────────────────────────────────────────
  const resetForm = () => {
    setImageUri(null);
    setTitle("");
    setDescription("");
    setCategory(null);
    setDifficulty(null);
    setSteps([{ step: 1, instruction: "" }]);
  };

  // ── Submit ──────────────────────────────────────────────────
  const handlePost = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a recipe.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Missing Photo", "Please add a cover photo for your recipe.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a recipe title.");
      return;
    }
    if (!category) {
      Alert.alert("Missing Category", "Please select a category.");
      return;
    }
    if (!difficulty) {
      Alert.alert("Missing Difficulty", "Please select a difficulty level.");
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim() !== "");
    if (validSteps.length === 0) {
      Alert.alert(
        "Missing Instructions",
        "Please add at least one instruction step.",
      );
      return;
    }

    setIsLoading(true);

    try {
      // Upload cover image
      const imageUrl = await uploadRecipeImage(user.id, imageUri);

      // Clean steps: remove empty ones and strip undefined optionals
      const cleanedSteps = validSteps.map((s, i) => {
        const cleaned: Record<string, unknown> = {
          step: i + 1,
          instruction: s.instruction.trim(),
        };
        if (s.timer !== undefined && s.timer > 0) cleaned.timer = s.timer;
        if (s.tip && s.tip.trim()) cleaned.tip = s.tip.trim();
        return cleaned;
      });

      // Insert recipe
      const { error } = await supabase.from("recipes").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl,
        category,
        difficulty,
        steps: cleanedSteps,
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success!", "Your recipe has been posted.", [
        { text: "OK", onPress: resetForm },
      ]);
    } catch (error) {
      console.error("Error creating recipe:", error);
      Alert.alert(
        "Error",
        "Failed to create your recipe. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <Text style={styles.headerTitle}>Create Recipe</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePost}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#F97B22", "#F5A623"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.postButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cover Photo Card */}
          <View style={styles.card}>
            <ImagePickerSection
              imageUri={imageUri}
              onPickImage={showImagePicker}
            />
          </View>

          {/* Details Card */}
          <View style={styles.card}>
            <FormInput
              label="Recipe Title"
              placeholder="e.g. Heirloom Tomato Tart"
              value={title}
              onChangeText={setTitle}
            />
            <FormInput
              label="Description"
              placeholder="Share the story behind this recipe..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Category & Difficulty Card */}
          <View style={styles.card}>
            <CategoryPicker selected={category} onSelect={setCategory} />
            <DifficultyPicker selected={difficulty} onSelect={setDifficulty} />
          </View>

          {/* Instructions Card */}
          <View style={styles.card}>
            <StepEditor steps={steps} onStepsChange={setSteps} />
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDF6EC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerSide: {
    width: 70,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2B1A12",
  },
  postButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 70,
    alignItems: "center",
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#EED9C7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#FFF9F2",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0DFD0",
  },
});