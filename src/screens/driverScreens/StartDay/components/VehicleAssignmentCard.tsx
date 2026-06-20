/**
 * VehicleAssignmentCard - Shows assigned vehicle details
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface VehicleAssignmentCardProps {
  vehicleNumber: string;
  vehicleName: string;
}

const VEHICLE_ICON_COLOR = '#FF9800';
const VEHICLE_ICON_BG = '#FFF3E0';
const SUCCESS_COLOR = '#4CAF50';

export function VehicleAssignmentCard({
  vehicleNumber,
  vehicleName,
}: VehicleAssignmentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Your Assignment</Text>
      </View>
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: VEHICLE_ICON_BG }]}>
          <MaterialCommunityIcons name="car" size={24} color={VEHICLE_ICON_COLOR} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Assigned Vehicle</Text>
          <Text style={styles.vehicleNumber}>{vehicleNumber}</Text>
          <Text style={styles.vehicleName}>{vehicleName}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Assigned</Text>
          <View style={styles.checkCircle}>
            <Feather name="check" size={14} color="#FFFFFF" />
          </View>
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  vehicleNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    letterSpacing: 0.5,
  },
  vehicleName: {
    fontSize: 14,
    color: '#616161',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: SUCCESS_COLOR,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: SUCCESS_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
