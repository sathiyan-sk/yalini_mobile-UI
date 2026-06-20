/**
 * HotelAssignmentCard - Shows assigned hotels details with view action
 */
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface HotelAssignmentCardProps {
  hotelCount: number;
  onViewHotels?: () => void;
}

const HOTEL_ICON_COLOR = '#4CAF50';
const HOTEL_ICON_BG = '#E8F5E9';
const SUCCESS_COLOR = '#4CAF50';

export function HotelAssignmentCard({
  hotelCount,
  onViewHotels,
}: HotelAssignmentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Your Assignment</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.mainContent}>
          <View style={[styles.iconCircle, { backgroundColor: HOTEL_ICON_BG }]}>
            <MaterialCommunityIcons name="office-building" size={24} color={HOTEL_ICON_COLOR} />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>Assigned Hotels</Text>
            <Text style={styles.hotelCount}>{hotelCount} Hotels</Text>
            <Text style={styles.sublabel}>Deliveries for today</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Assigned</Text>
            <View style={styles.checkCircle}>
              <Feather name="check" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* View Hotels Action */}
        <Pressable
          onPress={onViewHotels}
          style={({ pressed }) => [
            styles.viewAction,
            pressed && styles.viewActionPressed,
          ]}
        >
          <View style={styles.viewActionLeft}>
            <Feather name="list" size={20} color="#212121" />
            <Text style={styles.viewActionText}>View Assigned Hotels</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9E9E9E" />
        </Pressable>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  hotelCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  sublabel: {
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  viewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
  viewActionPressed: {
    backgroundColor: '#F5F5F5',
  },
  viewActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
});
