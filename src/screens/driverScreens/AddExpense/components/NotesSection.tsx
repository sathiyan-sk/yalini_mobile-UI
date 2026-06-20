/**
 * NotesSection - Optional notes input for expenses
 * Contains multiline text input with placeholder
 */

import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Notes (Optional)</Text>

      {/* Notes Input */}
      <View style={styles.inputContainer}>
        <Feather name="file-text" size={18} color={colors.textTertiary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={onNotesChange}
          placeholder="Add a note (if any)"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
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
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 80,
  },
  inputIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    padding: 0,
    minHeight: 60,
  },
});
