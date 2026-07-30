import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase/client';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { uploadProfileImage } from '@/lib/supabase/storage';
export default function Onboarding() {
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [isloading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const { updateUser, user } = useAuthStore();
    const router = useRouter()

   const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Please give media permissions");
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
      Alert.alert(
        "Permission needed",
        "We need camera permissions to take a photo.",
      );
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
    Alert.alert("Select profile image", "choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const handleComplete = async () => {
    if (!fullName || !username) {
      Alert.alert("Error", "Please fill in all fields");
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
    }
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        Alert.alert(
          "Error",
          "This username is already taken. Please choose another one.",
        );
        setIsLoading(false);
        return;
      }
      //upload profile image
       let profileImageUrl: string | undefined;
      if (profileImage) {
        try {
          profileImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          console.error("Error uploading profile image:", error);
          Alert.alert(
            "Warning",
            "Failed to upload profile image. Continuing without image.",
          );
        }
      }
       // Update profile
      await updateUser({
        name:fullName,
        username,
        profileImage: profileImageUrl,
        onboardingCompleted: true,
      });
      router.replace("/(tabs)");
    } catch (error) {
        Alert.alert(
        "Error",
        "Failed to complete the onboarding. Please try again.",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
    
    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#2B1A12" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Culina</Text>
                <View style={styles.backButton} />
            </View> */}

            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Create Profile</Text>
                    <Text style={styles.subtitle}>Let's set up your culinary identity.</Text>
                </View>

                <View style={styles.avatarSection}>
                  {profileImage ? (
                    <View>
                    <Image source={{ uri: profileImage }} style={styles.avatarCircle} />
                    <Text onPress={showImagePicker} style={styles.uploadText}>Change image</Text>
                    </View>
                  ) : (
                    <View>
                    <TouchableOpacity style={styles.avatarCircle}
                    onPress={showImagePicker}
                    >
                        <Ionicons name="camera-outline" size={32} color="#4A2E1C" />
                        <View style={styles.plusBadge}>
                            <Ionicons name="add" size={12} color="#4A2E1C" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.uploadText}>Upload Photo</Text>
                    </View>
                  )}
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person" size={20} color="#9C8478" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Julia Child"
                                placeholderTextColor="#B8A79B"
                                onChangeText={(text) => setFullName(text)}
                                value={fullName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="at" size={20} color="#9C8478" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. @juliacooks"
                                placeholderTextColor="#B8A79B"
                                onChangeText={(text) => setUsername(text)}
                                value={username}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.85}
                onPress={handleComplete}
                >
                    <LinearGradient
                        colors={['#F97B22', '#F5A623']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        {
                        isloading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                            <Text style={styles.buttonText}>Get Started</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </>
                        )
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FCEFDD',
    },
    backButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#C1440E',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2B1A12',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#8A7466',
        textAlign: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FBE1CF',
        borderWidth: 1.5,
        borderColor: '#E8B99B',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    plusBadge: {
        position: 'absolute',
        bottom: 30,
        right: 32,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FBE1CF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#C1440E',
    },
    form: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2B1A12',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FBF1E7',
        borderWidth: 1,
        borderColor: '#EED9C7',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 54,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#2B1A12',
    },
    buttonWrapper: {
        marginTop: 'auto',
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        gap: 8,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});