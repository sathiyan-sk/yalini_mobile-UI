import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";

interface HotelListHeaderProps {
  onMenuPress: () => void;
  onAddPress: () => void;
  testID?: string;
}

/**
 * Top-of-screen header for the Hotels list.
 *
 * - Left: hamburger menu (forwards to drawer/back).
 * - Middle: large "Hotels" title + supporting subtitle.
 * - Right: pill-shaped "+ Add Hotel" primary CTA.
 */
export function HotelListHeader({
  onMenuPress,
  onAddPress,
  testID,
}: HotelListHeaderProps) {
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.leftBlock}>
        <Pressable
          testID="hotels-menu-button"
          onPress={onMenuPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Menu"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Feather name="menu" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title} testID="hotels-title">
            Hotels
          </Text>
          <Text style={styles.subtitle}>Manage your water delivery hotels</Text>
        </View>
      </View>

      <Pressable
        testID="hotels-add-button"
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="Add a new hotel"
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Feather name="plus" size={18} color="#FFFFFF" />
        <Text style={styles.addLabel}>Add Hotel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  leftBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  titleBlock: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800",
    color: "#0B1F3F",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#4F46E5",
  },
  addLabel: {
    color: "#FFFFFF",
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
