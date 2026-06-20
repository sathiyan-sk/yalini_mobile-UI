/**
 * ExpenseDetailsCard - Main card for entering expense details
 * Contains expense categories with input fields and total calculation
 */

import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { ExpenseCategory, ExpenseFormData, ExpenseField } from '../../../../types/driver';

interface ExpenseDetailsCardProps {
  categories: ExpenseCategory[];
  formData: ExpenseFormData;
  onFieldChange: (field: ExpenseField, value: string) => void;
  totalExpense: number;
}

export function ExpenseDetailsCard({
  categories,
  formData,
  onFieldChange,
  totalExpense,
}: ExpenseDetailsCardProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Expense Details</Text>

      {/* Expense Categories */}
      {categories.map((category, index) => (
        <View key={category.id} style={styles.categoryRow}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: category.backgroundColor }]}>
            <MaterialIcons name={category.icon as any} size={20} color={category.color} />
          </View>

          {/* Category Info */}
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.amountInputContainer}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={formData[category.id as ExpenseField]}
              onChangeText={(value) => onFieldChange(category.id as ExpenseField, value)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
      ))}

      {/* Total Expense */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Expense</Text>
        <Text style={styles.totalValue}>₹{totalExpense}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categorySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minWidth: 100,
    height: 44,
  },
  rupeeSymbol: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
    padding: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: radius.md,
  },
  totalLabel: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
