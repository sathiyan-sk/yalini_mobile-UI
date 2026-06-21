/**
 * QuickActions - Quick action buttons for Staff Home Screen
 * Provides easy access to common actions like adding delivery, viewing all, and checkout
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';

interface QuickActionsProps {
  onAddDelivery: () => void;
  onAllDeliveries: () => void;
  onCheckout: () => void;
}

export function QuickActions({ onAddDelivery, onAllDeliveries, onCheckout }: QuickActionsProps) {
  return (
    <View style={[styles.container, cardShadow]}>
      <View style={styles.headerRow}>
        <Feather name="zap" size={18} color={colors.primaryBlue} />
        <Text style={styles.title}>Quick Actions</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAddDelivery}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primaryBlueSoft }]}>
            <Feather name="plus-circle" size={24} color={colors.primaryBlue} />
          </View>
          <Text style={styles.actionText}>Add Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAllDeliveries}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.actionText}>All Deliveries</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCheckout}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Feather name="check-square" size={24} color="#FF9800" />
          </View>
          <Text style={styles.actionText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
