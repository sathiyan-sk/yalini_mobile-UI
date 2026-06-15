import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { cardShadow, colors, fontSize, radius, spacing } from "../../../../theme";
import { getBusinessType } from "../data/businessTypes";
import type { BusinessRecord } from "../types";

interface BusinessListCardProps {
  business: BusinessRecord;
  onPress: () => void;
}

const MODE_COPY: Record<BusinessRecord["mode"], { label: string; helper: string }> = {
  auto: {
    label: "Auto Mode",
    helper: "Employees select their own",
  },
  manual: {
    label: "Manual Mode",
    helper: "Admin assigns",
  },
};

/**
 * Single row in the \"Business List\" section.
 *
 * Layout: colour-tinted type icon ▸ name + type/mode pills ▸ active status
 * pill + chevron, with a subtle helper line under the divider that
 * mirrors the reference design (\"Employees select their own vehicles\" /
 * \"Admin assigns hotels to employees\").
 */
export function BusinessListCard({ business, onPress }: BusinessListCardProps) {
  const type = getBusinessType(business.type);
  const mode = MODE_COPY[business.mode];

  return (
    <Pressable
      testID={`business-list-card-${business.id}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${business.name}, ${type.label}, ${mode.label}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconTile, { backgroundColor: type.iconBg }]}>
          <Ionicons name={type.icon} size={26} color={type.iconColor} />
        </View>

        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: type.tagBg }]}>
              <Text style={[styles.tagText, { color: type.iconColor }]}>
                {type.label}
              </Text>
            </View>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor:
                    business.mode === "auto" ? "#DBEAFE" : "#FFE4D5",
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  {
                    color:
                      business.mode === "auto" ? "#2563EB" : "#EA580C",
                  },
                ]}
              >
                {mode.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statusBlock}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: business.active ? "#DCFCE7" : "#FEE2E2",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: business.active ? "#16A34A" : "#DC2626" },
              ]}
            >
              {business.active ? "Active" : "Inactive"}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textTertiary} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.footerText} numberOfLines={1}>
          {business.mode === "auto"
            ? `Employees select their own ${type.assetNoun}`
            : `Admin assigns ${type.assetNoun} to employees`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.998 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  tagRow: {
    flexDirection: "row",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  statusBlock: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  statusPill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});