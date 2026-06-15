import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import type { Business } from "../../MyBusiness/types";

interface BusinessSelectorCardProps {
  business: Business;
  selected: boolean;
  onSelect: () => void;
  testID: string;
}

/**
 * Single radio-card used in the Add/Edit Employee \"Select Business\" picker.
 *
 * - Selected → 2px brand border + soft brand tint background.
 * - Unselected → 1px neutral border on white.
 */
export function BusinessSelectorCard({
  business,
  selected,
  onSelect,
  testID,
}: BusinessSelectorCardProps) {
  const palette = business.type === "taxi" ? tones.orange : tones.blue;
  const iconName = business.type === "taxi" ? "car-sport" : "water";

  return (
    <Pressable
      testID={testID}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: palette.iconBg }]}>
        <Ionicons name={iconName} size={22} color={palette.accent} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.label} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.subLabel} numberOfLines={1}>
          {business.type === "taxi" ? "City taxi / Call taxi service" : "Water delivery service"}
        </Text>
      </View>
      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={selected ? colors.brand : colors.textTertiary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  pressed: {
    opacity: 0.85,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  subLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
