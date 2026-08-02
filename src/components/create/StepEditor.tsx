import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface Step {
  step: number;
  instruction: string;
  timer?: number;
  tip?: string;
}

interface StepEditorProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
}

export default function StepEditor({ steps, onStepsChange }: StepEditorProps) {
  const addStep = () => {
    onStepsChange([
      ...steps,
      { step: steps.length + 1, instruction: "" },
    ]);
  };

  const updateInstruction = (index: number, text: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], instruction: text };
    onStepsChange(updated);
  };

  const updateTimer = (index: number, text: string) => {
    const updated = [...steps];
    const value = text === "" ? undefined : parseInt(text, 10);
    if (text !== "" && isNaN(value!)) return;
    updated[index] = { ...updated[index], timer: value };
    onStepsChange(updated);
  };

  const updateTip = (index: number, text: string) => {
    const updated = [...steps];
    updated[index] = {
      ...updated[index],
      tip: text === "" ? undefined : text,
    };
    onStepsChange(updated);
  };

  const removeStep = (index: number) => {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, step: i + 1 }));
    onStepsChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Instructions</Text>

      {steps.map((item, index) => (
        <View key={index} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{item.step}</Text>
            </View>
            <Text style={styles.stepTitle}>Step {item.step}</Text>
            {steps.length > 1 && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeStep(index)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={22} color="#D4836D" />
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.instructionInput}
            placeholder="What should the cook do?"
            placeholderTextColor="#B8A79B"
            value={item.instruction}
            onChangeText={(text) => updateInstruction(index, text)}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.optionalRow}>
            <View style={styles.optionalField}>
              <View style={styles.optionalLabel}>
                <Ionicons name="timer-outline" size={14} color="#9C8478" />
                <Text style={styles.optionalLabelText}>Timer (min)</Text>
              </View>
              <TextInput
                style={styles.optionalInput}
                placeholder="—"
                placeholderTextColor="#C9B9AC"
                value={item.timer !== undefined ? String(item.timer) : ""}
                onChangeText={(text) => updateTimer(index, text)}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.optionalField, { flex: 2 }]}>
              <View style={styles.optionalLabel}>
                <Ionicons name="bulb-outline" size={14} color="#9C8478" />
                <Text style={styles.optionalLabelText}>Tip</Text>
              </View>
              <TextInput
                style={styles.optionalInput}
                placeholder="Optional tip..."
                placeholderTextColor="#C9B9AC"
                value={item.tip ?? ""}
                onChangeText={(text) => updateTip(index, text)}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={addStep}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle-outline" size={22} color="#F97B22" />
        <Text style={styles.addButtonText}>Add Step</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B1A12",
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: "#FBF1E7",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EED9C7",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F97B22",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B1A12",
    flex: 1,
  },
  deleteBtn: {
    padding: 2,
  },
  instructionInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EED9C7",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#2B1A12",
    minHeight: 60,
    marginBottom: 10,
  },
  optionalRow: {
    flexDirection: "row",
    gap: 10,
  },
  optionalField: {
    flex: 1,
  },
  optionalLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  optionalLabelText: {
    fontSize: 12,
    color: "#9C8478",
    fontWeight: "600",
  },
  optionalInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EED9C7",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#2B1A12",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F97B22",
    borderStyle: "dashed",
    backgroundColor: "#FFF7F0",
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F97B22",
  },
});
