import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#B8A79B"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FBF1E7",
    borderWidth: 1,
    borderColor: "#EED9C7",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2B1A12",
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: 14,
  },
});
