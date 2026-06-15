import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { cardShadow, colors, fontSize, radius, spacing } from "../../../../theme";

interface BusinessStatsCardProps {
  totalBusinesses: number;
  activeBusinesses: number;
}

/**
 * White summary card surfaced just below the navy header.
 *
 * Holds two equal columns: \"Total Businesses\" (info / blue) on the left
 * and \"Active Businesses\" (success / green) on the right, divided by a
 * subtle vertical hairline. Counts are rendered with display-size
 * typography so the card stays glanceable from a distance.
 */
export function BusinessStatsCard({
  totalBusinesses,
  activeBusinesses,
}: BusinessStatsCardProps) {
  return (
    <View style={styles.card} testID="business-stats-card">
      <View style={styles.column}>
        <View style={[styles.iconTile, { backgroundColor: "#E0E7FF" }]}>
          <Ionicons name="business" size={22} color="#2563EB" />
        </View>
        <View style={styles.copyBlock}>
          <Text style={styles.label}>Total Businesses</Text>
          <Text
            style={[styles.value, { color: "#2563EB" }]}
            testID="business-stats-total"
          >
            {totalBusinesses}
          </Text>
          <Text style={styles.subLabel}>Businesses</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.column}>
        <View style={[styles.iconTile, { backgroundColor: "#DCFCE7" }]}>
          <Feather name="shopping-bag" size={20} color="#16A34A" />
        </View>
        <View style={styles.copyBlock}>
          <Text style={styles.label}>Active Businesses</Text>
          <Text
            style={[styles.value, { color: "#16A34A" }]}
            testID="business-stats-active"
          >
            {activeBusinesses}
          </Text>
          <Text style={styles.subLabel}>Businesses</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    ...cardShadow,
  },
  column: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  copyBlock: {
    flexShrink: 1,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    marginTop: 2,
  },
  subLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    marginVertical: spacing.xs,
    backgroundColor: colors.borderLight,
  },
});