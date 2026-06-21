/**
 * InfoBanner - Displays informational message to user.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../../../theme';

interface InfoBannerProps {
  /** Message to display */
  message: string;
}

export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <View style={styles.container}>
      <Feather name="info" size={18} color={colors.primaryBlue} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBlueSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.primaryBlue,
    lineHeight: 20,
  },
});
