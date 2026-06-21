/**
 * DeliveriesList - List of delivery cards.
 * Renders all delivery records with edit functionality.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../../../theme';
import { DeliveryCard } from './DeliveryCard';
import type { DeliveryRecord } from '../../AddDelivery/types';

interface DeliveriesListProps {
  /** Array of delivery records */
  deliveries: DeliveryRecord[];
  /** Handler when a delivery card is pressed */
  onDeliveryPress: (delivery: DeliveryRecord) => void;
  /** Handler when edit button is pressed */
  onEditDelivery: (delivery: DeliveryRecord) => void;
}

export function DeliveriesList({
  deliveries,
  onDeliveryPress,
  onEditDelivery,
}: DeliveriesListProps) {
  if (deliveries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBg}>
          <Feather name="inbox" size={32} color={colors.textTertiary} />
        </View>
        <Text style={styles.emptyTitle}>No Deliveries Yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first delivery to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Deliveries</Text>
      {deliveries.map((delivery) => (
        <DeliveryCard
          key={delivery.id}
          delivery={delivery}
          onPress={() => onDeliveryPress(delivery)}
          onEdit={() => onEditDelivery(delivery)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
