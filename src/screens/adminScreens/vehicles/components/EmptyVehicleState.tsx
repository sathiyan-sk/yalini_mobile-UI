import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface EmptyVehicleStateProps {
  hasFilters: boolean;
  onAddPress: () => void;
  onClearFilters: () => void;
  testID?: string;
}

export function EmptyVehicleState({
  hasFilters,
  onAddPress,
  onClearFilters,
  testID,
}: EmptyVehicleStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconCircle}>
        <Ionicons name="car-outline" size={32} color={colors.brand} />
      </View>
      <Text style={styles.title}>
        {hasFilters ? "No vehicles found" : "No vehicles yet"}
      </Text>
      <Text style={styles.description}>
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Add your first vehicle to start managing your fleet"}
      </Text>
      <Pressable
        onPress={hasFilters ? onClearFilters : onAddPress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        testID={`${testID}-action`}
      >
        <Text style={styles.buttonText}>
          {hasFilters ? "Clear Filters" : "Add Vehicle"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    marginTop: spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: "600",
  },
});
