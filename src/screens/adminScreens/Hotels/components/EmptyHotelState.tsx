import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";

interface EmptyHotelStateProps {
  hasFilters: boolean;
  onAddPress: () => void;
  onClearFilters: () => void;
  testID?: string;
}

/**
 * Empty state shown when the hotels list is empty.
 * Shows different message depending on whether filters are active.
 */
export function EmptyHotelState({
  hasFilters,
  onAddPress,
  onClearFilters,
  testID,
}: EmptyHotelStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconCircle}>
        <Feather name="home" size={32} color="#4F46E5" />
      </View>
      <Text style={styles.title}>
        {hasFilters ? "No hotels found" : "No hotels yet"}
      </Text>
      <Text style={styles.description}>
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Add your first hotel to start managing water deliveries."}
      </Text>
      {hasFilters ? (
        <Pressable
          testID="clear-filters-button"
          onPress={onClearFilters}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Feather name="x" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>Clear Filters</Text>
        </Pressable>
      ) : (
        <Pressable
          testID="add-first-hotel-button"
          onPress={onAddPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Hotel</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "#4F46E5",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
