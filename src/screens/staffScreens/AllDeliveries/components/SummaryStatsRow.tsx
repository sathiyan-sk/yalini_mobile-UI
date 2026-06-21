/**
 * SummaryStatsRow - Displays summary statistics for deliveries.
 * Shows total deliveries and total cans delivered.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';

interface SummaryStatsRowProps {
  /** Total number of deliveries */
  totalDeliveries: number;
  /** Total cans delivered */
  totalCansDelivered: number;
}

export function SummaryStatsRow({
  totalDeliveries,
  totalCansDelivered,
}: SummaryStatsRowProps) {
  return (
    <View style={styles.container}>
      {/* Total Deliveries */}
      <View style={styles.statCard}>
        <View style={[styles.iconBg, { backgroundColor: colors.brandSoft }]}>
          <Feather name="truck" size={18} color={colors.brand} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{totalDeliveries}</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>
      </View>

      {/* Total Cans */}
      <View style={styles.statCard}>
        <View style={[styles.iconBg, { backgroundColor: colors.primaryBlueSoft }]}>
          <MaterialCommunityIcons name="water" size={18} color={colors.primaryBlue} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{totalCansDelivered}</Text>
          <Text style={styles.statLabel}>Cans Delivered</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
