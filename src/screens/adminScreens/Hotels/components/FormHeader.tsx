import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, spacing } from "../../../../theme";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  topInset: number;
  testID?: string;
}

/**
 * Form header with back button, title, subtitle and hotel icon.
 * Matches the design exactly with the purple hotel icon on the right.
 */
export function FormHeader({
  title,
  subtitle,
  onBack,
  topInset,
  testID,
}: FormHeaderProps) {
  return (
    <View
      style={[styles.container, { paddingTop: topInset + spacing.sm }]}
      testID={testID}
    >
      <View style={styles.leftSection}>
        <Pressable
          testID="form-back-button"
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.iconContainer}>
        <Ionicons name="business" size={32} color="#4F46E5" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surfaceSecondary,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0B1F3F",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
