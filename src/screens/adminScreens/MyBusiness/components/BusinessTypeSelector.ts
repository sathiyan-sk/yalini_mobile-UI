import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import { BUSINESS_TYPES } from "../data/businessTypes";
import type { BusinessTypeId } from "../types";

interface BusinessTypeSelectorProps {
  value: BusinessTypeId;
  onChange: (next: BusinessTypeId) => void;
  /**
   * When true the selector renders as a read-only display of the picked
   * type. Used on the Edit Business screen, where the type is locked once
   * the business is created (changing the type would invalidate the
   * employee → asset assignments).
   */
  locked?: boolean;
}

/**
 * Picker for the \"Business Type\" form field.
 *
 * Renders one card per entry in `BUSINESS_TYPES` arranged in a flex row.
 * Each card has a tinted icon tile + label + radio indicator on the
 * trailing edge; the selected card gets a green border so it stands out
 * without changing its size (no layout shift on selection).
 */
export function BusinessTypeSelector({
  value,
  onChange,
  locked = false,
}: BusinessTypeSelectorProps) {
  if (locked) {
    const selected =
      BUSINESS_TYPES.find((entry) => entry.id === value) ?? BUSINESS_TYPES[0];

    return (
      <View style={styles.lockedRow} testID="business-type-locked">
        <View style={[styles.iconTile, { backgroundColor: selected.iconBg }]}>
          <Ionicons name={selected.icon} size={22} color={selected.iconColor} />
        </View>
        <Text style={styles.lockedLabel}>{selected.label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.row} testID="business-type-selector">
      {BUSINESS_TYPES.map((type) => {
        const selected = value === type.id;
        return (
          <Pressable
            key={type.id}
            testID={`business-type-option-${type.id}`}
            onPress={() => onChange(type.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={type.label}
            style={({ pressed }) => [
              styles.card,
              selected && styles.cardSelected,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.iconTile, { backgroundColor: type.iconBg }]}>
              <Ionicons
                name={type.icon}
                size={22}
                color={type.iconColor}
              />
            </View>
            <Text style={styles.label}>{type.label}</Text>
            <View
              style={[
                styles.radioOuter,
                selected && styles.radioOuterSelected,
              ]}
            >
              {selected ? <View style={styles.radioInner} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 60,
  },
  cardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  pressed: {
    opacity: 0.85,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#16A34A",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },
  lockedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "#F5F6FB",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  lockedLabel: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: "#0B1F3F",
  },
});