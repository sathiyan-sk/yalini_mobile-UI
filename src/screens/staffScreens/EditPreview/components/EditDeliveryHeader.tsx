/**
 * EditDeliveryHeader - Header component for EditPreview screen.
 * Shows back button and title.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../../../theme';

interface EditDeliveryHeaderProps {
  /** Handler for back button press */
  onBackPress: () => void;
}

export function EditDeliveryHeader({ onBackPress }: EditDeliveryHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={24} color={colors.surface} />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Delivery</Text>

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
});
