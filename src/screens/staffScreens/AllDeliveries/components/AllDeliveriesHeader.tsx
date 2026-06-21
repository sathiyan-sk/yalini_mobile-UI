/**
 * AllDeliveriesHeader - Header component for AllDeliveries screen.
 * Shows title with back and filter options.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../../../theme';

interface AllDeliveriesHeaderProps {
  /** Handler for menu button press */
  onMenuPress?: () => void;
  /** Handler for filter button press */
  onFilterPress?: () => void;
}

export function AllDeliveriesHeader({
  onMenuPress,
  onFilterPress,
}: AllDeliveriesHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>


      <Text style={styles.title}>All Deliveries</Text>

      <View style={styles.rightSection}>
        {onFilterPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Feather name="filter" size={22} color={colors.surface} />
          </TouchableOpacity>
        )}
      </View>
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
  leftSection: {
    width: 40,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
    flex: 1,
    textAlign: 'left',
  },
  iconButton: {
    padding: spacing.xs,
  },
});
