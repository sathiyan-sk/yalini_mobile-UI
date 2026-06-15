import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { BusinessMode } from "../types";

interface BusinessModeSelectorProps {
  value: BusinessMode;
  onChange: (next: BusinessMode) => void;
  /** Sentence-cased noun (\"vehicles\" / \"delivery routes\") woven into copy. */
  assetNoun: string;
}

interface ModeOption {
  id: BusinessMode;
  title: string;
  buildDescription: (assetNoun: string) => string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: "auto",
    title: "Auto Mode (Employee Choice)",
    buildDescription: (noun) =>
      `Employees can select their own business assets (${noun}) from available options.`,
    icon: "person",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "manual",
    title: "Manual Mode (Admin Assignment)",
    buildDescription: (noun) =>
      `Admin will assign ${noun} to employees by default.`,
    icon: "people",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
];

/**
 * Two-card radio group used to pick the asset assignment strategy.
 *
 * - The Auto card lists what employees can self-serve.
 * - The Manual card lists what the admin allocates.
 * Selected state matches the reference: green border + soft green bg + a
 * filled green radio circle on the right edge. Cards are full-width and
 * stacked vertically so the longer description copy stays legible.
 */
export function BusinessModeSelector({
  value,
  onChange,
  assetNoun,
}: BusinessModeSelectorProps) {
  return (
    <View style={styles.stack} testID="business-mode-selector">
      {MODE_OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <Pressable
            key={option.id}
            testID={`business-mode-option-${option.id}`}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.title}
            style={({ pressed }) => [
              styles.card,
              selected && styles.cardSelected,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[styles.iconTile, { backgroundColor: option.iconBg }]}
            >
              <Ionicons
                name={option.icon}
                size={22}
                color={option.iconColor}
              />
            </View>

            <View style={styles.body}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.description}>
                {option.buildDescription(assetNoun)}
              </Text>
            </View>

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
  stack: {
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  cardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  pressed: {
    opacity: 0.92,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  description: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: "#16A34A",
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#16A34A",
  },
});