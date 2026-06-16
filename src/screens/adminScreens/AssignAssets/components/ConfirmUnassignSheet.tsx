import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import type { Employee } from "../../Employees/types";
import type { AssetType } from "../types";

interface ConfirmUnassignSheetProps {
  visible: boolean;
  employee: Employee | null;
  assetName: string;
  assetType: AssetType;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

export function ConfirmUnassignSheet({
  visible,
  employee,
  assetName,
  assetType,
  onConfirm,
  onCancel,
  testID,
}: ConfirmUnassignSheetProps) {
  const insets = useSafeAreaInsets();

  if (!employee) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.iconContainer}>
          <Ionicons
            name="warning"
            size={32}
            color={tones.orange.accent}
          />
        </View>

        <Text style={styles.title}>Unassign {assetType === "vehicle" ? "Vehicle" : "Hotel"}?</Text>
        <Text style={styles.message}>
          Are you sure you want to unassign <Text style={styles.bold}>{assetName}</Text> from{" "}
          <Text style={styles.bold}>{employee.fullName}</Text>?
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            testID={`${testID}-cancel`}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}
            testID={`${testID}-confirm`}
          >
            <Text style={styles.confirmButtonText}>Unassign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tones.orange.cardBg,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  message: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  bold: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.surfaceTertiary,
  },
  cancelButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: tones.red.accent,
  },
  confirmButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#fff",
  },
});
