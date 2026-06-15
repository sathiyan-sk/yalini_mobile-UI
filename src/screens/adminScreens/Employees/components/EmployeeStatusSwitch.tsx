import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { EmployeeStatusId } from "../types";

interface EmployeeStatusSwitchProps {
  value: EmployeeStatusId;
  onChange: (next: EmployeeStatusId) => void;
  testID?: string;
}

/**
 * Enable Employee Login toggle row used in the Add and Edit Employee forms.
 */
export function EmployeeStatusSwitch({
  value,
  onChange,
  testID,
}: EmployeeStatusSwitchProps) {
  const isActive = value === "active";

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done-outline" size={20} color={colors.brand} />
        </View>
        <Text style={styles.sectionTitle}>Access Status</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Enable Employee Login</Text>
        <Switch
          testID={`${testID ?? "status"}-switch`}
          value={isActive}
          onValueChange={(next) => onChange(next ? "active" : "disabled")}
          trackColor={{ false: "#D1D5DB", true: "#818CF8" }}
          thumbColor={isActive ? "#4F46E5" : "#F3F4F6"}
          ios_backgroundColor="#D1D5DB"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
});
