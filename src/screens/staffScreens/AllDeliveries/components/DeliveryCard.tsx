/**
 * DeliveryCard - Individual delivery card showing delivery details.
 * Shows hotel name, cans info, income, expense, and edit button.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { DeliveryRecord } from '../../AddDelivery/types';

interface DeliveryCardProps {
  /** The delivery record to display */
  delivery: DeliveryRecord;
  /** Handler when card is pressed */
  onPress: () => void;
  /** Handler when edit button is pressed */
  onEdit: () => void;
}

export function DeliveryCard({ delivery, onPress, onEdit }: DeliveryCardProps) {
  const paymentIcon = delivery.paymentMode === 'CASH' ? 'local-atm' : 'smartphone';
  const paymentLabel = delivery.paymentMode === 'CASH' ? 'Cash' : 'Online';
  const hasExpense = delivery.expenseCategory && delivery.expenseAmount && delivery.expenseAmount > 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Side - Hotel Icon */}
      <View style={styles.leftSection}>
        <View style={styles.hotelIconBg}>
          <MaterialIcons name="location-city" size={20} color={colors.primaryBlue} />
        </View>
      </View>

      {/* Middle Section - Delivery Details */}
      <View style={styles.middleSection}>
        {/* Hotel Name */}
        <Text style={styles.hotelName} numberOfLines={1}>{delivery.hotelName}</Text>

        {/* Cans Info Row */}
        <View style={styles.cansRow}>
          <View style={styles.cansItem}>
            <MaterialCommunityIcons name="water" size={14} color={colors.textSecondary} />
            <Text style={styles.cansText}>{delivery.cansDelivered} delivered</Text>
          </View>
          <View style={styles.cansDivider} />
          <View style={styles.cansItem}>
            <Feather name="refresh-ccw" size={12} color={colors.textSecondary} />
            <Text style={styles.cansText}>{delivery.cansReturned} returned</Text>
          </View>
        </View>

        {/* Payment Mode & Rate */}
        <View style={styles.detailsRow}>
          <View style={styles.paymentBadge}>
            <MaterialIcons name={paymentIcon} size={12} color={colors.textSecondary} />
            <Text style={styles.paymentText}>{paymentLabel}</Text>
          </View>
          <View style={styles.rateBadge}>
            <Text style={styles.rateText}>₹{delivery.ratePerCan}/can</Text>
          </View>
        </View>
      </View>

      {/* Right Section - Amount & Edit */}
      <View style={styles.rightSection}>
        {/* Income Amount */}
        <View style={styles.amountRow}>
          <Text style={styles.incomeAmount}>₹{delivery.receivedIncome.toLocaleString('en-IN')}</Text>
          <Feather name="chevron-right" size={18} color={colors.textTertiary} />
        </View>

        {/* Expense Info or Edit */}
        {hasExpense ? (
          <View style={styles.expenseContainer}>
            <View style={styles.expenseAddedBadge}>
              <Feather name="check-circle" size={12} color="#2E7D32" />
              <Text style={styles.expenseAddedText}>Expense: ₹{delivery.expenseAmount}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noExpenseContainer}>
            <Text style={styles.noExpenseText}>No expense</Text>
          </View>
        )}

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          activeOpacity={0.7}
        >
          <Feather name="edit-2" size={14} color={colors.primaryBlue} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  leftSection: {
    marginRight: spacing.md,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  hotelIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
  },
  hotelName: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cansRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cansItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cansText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  cansDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
    gap: 4,
  },
  paymentText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  rateBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  rateText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 100,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeAmount: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#2E7D32',
    marginRight: spacing.xs,
  },
  expenseContainer: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  expenseAddedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    gap: 4,
  },
  expenseAddedText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#2E7D32',
  },
  noExpenseContainer: {
    marginTop: spacing.xs,
  },
  noExpenseText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBlueSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    gap: 4,
  },
  editText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primaryBlue,
  },
});
