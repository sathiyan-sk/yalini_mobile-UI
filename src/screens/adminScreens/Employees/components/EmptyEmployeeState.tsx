import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface EmptyEmployeeStateProps {
  hasFilters: boolean;
  onAddPress: () => void;
  onClearFilters: () => void;
  testID?: string;
}

/**
 * Empty state shown when no employees match the current search/filter criteria.
 */
export function EmptyEmployeeState({
  hasFilters,
  testID,
}: EmptyEmployeeStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconCircle}>
        <Feather name="users" size={32} color={colors.textTertiary} />
      </View>
      <Text style={styles.title}>
        {hasFilters ? "No employees found" : "No employees yet"}
      </Text>
      <Text style={styles.description}>
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Add your first employee to get started."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
