/**
 * SessionInfoCard - Displays current session information.
 * Shows staff name, service, date and time.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { DeliverySessionData } from '../../AddDelivery/types';

interface SessionInfoCardProps {
  /** Session data to display */
  sessionInfo: DeliverySessionData;
}

export function SessionInfoCard({ sessionInfo }: SessionInfoCardProps) {
  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Feather name="droplet" size={20} color={colors.primaryBlue} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.serviceName}>{sessionInfo.serviceName}</Text>
          <Text style={styles.staffName}>{sessionInfo.staffName}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{sessionInfo.sessionStatus}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <MaterialIcons name="event" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{sessionInfo.sessionDate}</Text>
        </View>
        <View style={styles.detailItem}>
          <Feather name="clock" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{sessionInfo.sessionTime}</Text>
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
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  staffName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.successDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
