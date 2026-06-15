import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontSize, spacing } from "../../../../theme";
import { FORM_HEADER_BG } from "../data/constants";

interface EmployeeFormHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onHelp?: () => void;
  /** Extra top padding applied by the parent (typically `insets.top`). */
  topInset: number;
  testID?: string;
}

/**
 * Sticky header for the Add / Edit Employee screens.
 *
 * Layout: [← back] [title (2-line stack)] [? help].
 */
export function EmployeeFormHeader({
  title,
  subtitle,
  onBack,
  onHelp,
  topInset,
  testID,
}: EmployeeFormHeaderProps) {
  return (
    <View
      style={[styles.container, { paddingTop: topInset + spacing.sm }]}
      testID={testID}
    >
      <Pressable
        testID={`${testID ?? "form-header"}-back`}
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Ionicons name="arrow-back" size={26} color="#0B1F3F" />
      </Pressable>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {onHelp ? (
        <Pressable
          testID={`${testID ?? "form-header"}-help`}
          onPress={onHelp}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Help"
          style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
        >
          <Ionicons name="help-circle-outline" size={26} color="#0B1F3F" />
        </Pressable>
      ) : (
        <View style={styles.helpPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  titleBlock: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#0B1F3F",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.sm,
    lineHeight: 18,
    color: "#6B7280",
  },
  helpButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  helpPlaceholder: {
    width: 36,
  },
});
