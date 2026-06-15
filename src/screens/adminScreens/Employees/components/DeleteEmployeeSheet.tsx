import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface DeleteEmployeeSheetProps {
  visible: boolean;
  employeeName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation bottom sheet for deleting an employee.
 */
export function DeleteEmployeeSheet({
  visible,
  employeeName,
  onCancel,
  onConfirm,
}: DeleteEmployeeSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
          </View>
          <Text style={styles.title}>Delete Employee?</Text>
          <Text style={styles.body}>
            Are you sure you want to delete{" "}

            <Text style={styles.boldText}>{employeeName}</Text>? This action
            cannot be undone.
          </Text>
          <View style={styles.buttons}>
            <Pressable
              testID="delete-employee-cancel"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              testID="delete-employee-confirm"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  iconWrap: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  boldText: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  cancelText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  confirmButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
  },
  confirmText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.7,
  },
});
