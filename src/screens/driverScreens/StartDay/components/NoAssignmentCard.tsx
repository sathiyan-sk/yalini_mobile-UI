/**
 * NoAssignmentCard - Shows error state when no vehicle/hotel is assigned
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NoAssignmentCardProps {
  type: 'vehicle' | 'hotel';
}

const ERROR_COLOR = '#F44336';
const ERROR_BG = '#FFEBEE';

export function NoAssignmentCard({ type }: NoAssignmentCardProps) {
  const isVehicle = type === 'vehicle';
  const title = isVehicle ? 'No Vehicle Assigned' : 'No Hotels Assigned';
  const description = isVehicle
    ? 'You do not have any vehicle assigned for today.\nPlease contact admin.'
    : 'You do not have any hotels assigned for today.\nPlease contact admin.';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Your Assignment</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="alert-circle-outline" size={32} color={ERROR_COLOR} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  header: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: ERROR_BG,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  iconCircle: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: ERROR_COLOR,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
});
