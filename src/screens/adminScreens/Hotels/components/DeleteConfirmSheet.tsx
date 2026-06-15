import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";

interface DeleteConfirmSheetProps {
  visible: boolean;
  hotelName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Bottom sheet confirmation for deleting a hotel.
 */
export function DeleteConfirmSheet({
  visible,
  hotelName,
  onCancel,
  onConfirm,
}: DeleteConfirmSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />
          
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Feather name="trash-2" size={28} color="#DC2626" />
            </View>
          </View>

          <Text style={styles.title}>Delete Hotel</Text>
          <Text style={styles.message}>
            Are you sure you want to delete{" "}
            <Text style={styles.hotelName}>"{hotelName}"</Text>? This action
            cannot be undone.
          </Text>

          <View style={styles.buttons}>
            <Pressable
              testID="delete-cancel-button"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              testID="delete-confirm-button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
            >
              <Feather name="trash-2" size={18} color="#FFFFFF" />
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  hotelName: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  cancelButton: {
    backgroundColor: colors.surfaceTertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  deleteText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.8,
  },
});
