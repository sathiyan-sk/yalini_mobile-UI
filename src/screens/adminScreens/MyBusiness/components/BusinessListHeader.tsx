import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontSize, spacing } from "../../../../theme";

/** Dark navy palette used by the My Business header surfaces. */
const HEADER_BG = "#0F1F47";
const HEADER_SUBTITLE = "#C7D2EF";

interface BusinessListHeaderProps {
  onAddPress: () => void;
  onBackPress?: () => void;
}

/**
 * Sticky top header rendered on the My Businesses listing screen.
 *
 * - Solid dark-navy surface that extends behind the status bar (handled by
 *   the parent's `paddingTop = insets.top`).
 * - Page title + supporting copy on the left, white \"+ Add Business\" CTA
 *   on the right. The CTA stays opaque (white) for max contrast against
 *   the navy background and matches the reference design exactly.
 */
export function BusinessListHeader({
  onAddPress,
  onBackPress,
}: BusinessListHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.sm }]}
      testID="my-business-header"
    >
      <View style={styles.row}>
        {onBackPress ? (
          <Pressable
            testID="my-business-back-button"
            onPress={onBackPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        ) : null}

        <View style={styles.titleBlock}>
          <Text style={styles.title} testID="my-business-title">
            My Businesses
          </Text>
          <Text style={styles.subtitle}>Manage your business configurations</Text>
        </View>

        <Pressable
          testID="my-business-add-button"
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel="Add business"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Feather name="plus" size={18} color="#1D4ED8" />
          <Text style={styles.addButtonText}>Add Business</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    ...Platform.select({
      ios: { shadowColor: "transparent" },
      android: { elevation: 0 },
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    color: HEADER_SUBTITLE,
    fontSize: fontSize.base,
    lineHeight: 18,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 40,
  },
  addButtonText: {
    color: "#0F1F47",
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
});