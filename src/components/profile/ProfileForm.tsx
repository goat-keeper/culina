import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProfileFormProps {
  fullName: string;
  setFullName: (text: string) => void;
  username: string;
  setUsername: (text: string) => void;
}

export default function ProfileForm({
  fullName,
  setFullName,
  username,
  setUsername,
}: ProfileFormProps) {
  return (
    <View style={styles.formCard}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#9C8478"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="e.g. Alex Rivera"
            placeholderTextColor="#B8A79B"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="at"
            size={20}
            color="#9C8478"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="username"
            placeholderTextColor="#B8A79B"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0DFD0",
    gap: 16,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B1A12",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF1E7",
    borderWidth: 1,
    borderColor: "#EED9C7",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#2B1A12",
  },
});
