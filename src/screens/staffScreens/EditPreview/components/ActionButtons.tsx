/**
 * ActionButtons - Save and Delete action buttons.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../../../theme';

interface ActionButtonsProps {
  /** Handler for save button */
  onSave: () => void;
  /** Handler for delete button */
  onDelete: () => void;
  /** Whether save is in progress */
  isSubmitting: boolean;
}

export function ActionButtons({ onSave, onDelete, isSubmitting }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, isSubmitting && styles.buttonDisabled]}
        onPress={onSave}
        activeOpacity={0.8}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={colors.surface} />
        ) : (
          <>
            <Feather name="check" size={20} color={colors.surface} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.8}
        disabled={isSubmitting}
      >
        <Feather name="trash-2" size={20} color={colors.error} />
        <Text style={styles.deleteButtonText}>Delete Delivery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.surface,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorSoft,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
  },
});
