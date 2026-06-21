/**
 * DeliverySummaryCard - Shows summary of the delivery being edited.
 * Displays hotel name, rate, and key metrics.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { DeliveryRecord } from '../../AddDelivery/types';

interface DeliverySummaryCardProps {
  /** The delivery record being edited */
  delivery: DeliveryRecord;
  /** Current form values for display */
  formValues: {
    cansDelivered: number;
    cansReturned: number;
    outstandingCans: number;
    estAmount: number;
    receivedIncome: number;
  };
}

export function DeliverySummaryCard({ delivery, formValues }: DeliverySummaryCardProps) {
  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="location-city" size={20} color={colors.primaryBlue} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.hotelName}>{delivery.hotelName}</Text>
          <Text style={styles.rateText}>₹{delivery.ratePerCan} per can</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={[styles.metricIconBg, { backgroundColor: colors.primaryBlueSoft }]}>
            <MaterialCommunityIcons name="water" size={16} color={colors.primaryBlue} />
          </View>
          <Text style={styles.metricValue}>{formValues.cansDelivered}</Text>
          <Text style={styles.metricLabel}>Delivered</Text>
        </View>

        <View style={styles.metricItem}>
          <View style={[styles.metricIconBg, { backgroundColor: colors.warningSoft }]}>
            <MaterialCommunityIcons name="water-off" size={16} color={colors.warning} />
          </View>
          <Text style={styles.metricValue}>{formValues.cansReturned}</Text>
          <Text style={styles.metricLabel}>Returned</Text>
        </View>

        <View style={styles.metricItem}>
          <View style={[styles.metricIconBg, { backgroundColor: colors.errorSoft }]}>
            <MaterialCommunityIcons name="water-outline" size={16} color={colors.error} />
          </View>
          <Text style={styles.metricValue}>{formValues.outstandingCans}</Text>
          <Text style={styles.metricLabel}>Outstanding</Text>
        </View>
      </View>

      {/* Amount Row */}
      <View style={styles.amountRow}>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Est. Amount</Text>
          <Text style={styles.amountValue}>₹{formValues.estAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.amountDivider} />
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Received</Text>
          <Text style={[styles.amountValue, { color: '#2E7D32' }]}>
            ₹{formValues.receivedIncome.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  hotelName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rateText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  amountValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  amountDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});
