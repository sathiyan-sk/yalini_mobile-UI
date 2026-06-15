import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface VehicleListHeaderProps {
  onMenuPress: () => void;
  onAddPress: () => void;
  testID?: string;
}

export function VehicleListHeader({
  onMenuPress,
  onAddPress,
  testID,
}: VehicleListHeaderProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.leftSection}>
        <Pressable
          onPress={onMenuPress}
          style={styles.menuButton}
          hitSlop={8}
          testID={`${testID}-menu`}
        >
          <Feather name="menu" size={24} color={colors.brand} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Vehicles</Text>
          <Text style={styles.subtitle}>Manage your taxi fleet</Text>
        </View>
      </View>
      <Pressable
        onPress={onAddPress}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        testID={`${testID}-add`}
      >
        <Feather name="plus" size={18} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Vehicle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    gap: 2,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.brand,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: "600",
  },
});
