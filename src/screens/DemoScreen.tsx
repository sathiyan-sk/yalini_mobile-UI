/**
 * Demo screen that shows both Driver and Staff Start Day screens side by side
 * This allows easy preview of all four design states
 */
import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DriverStartDayScreen from './driverScreens/StartDay/StartDayScreen';
import StaffStartDayScreen from './staffScreens/StartDay/StaffStartDayScreen';

type ScreenType = 'driver-assigned' | 'driver-unassigned' | 'staff-assigned' | 'staff-unassigned';

const TABS: { key: ScreenType; label: string }[] = [
  { key: 'driver-assigned', label: 'Driver (Assigned)' },
  { key: 'driver-unassigned', label: 'Driver (No Vehicle)' },
  { key: 'staff-assigned', label: 'Staff (Assigned)' },
  { key: 'staff-unassigned', label: 'Staff (No Hotels)' },
];

export default function DemoScreen() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('driver-assigned');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'driver-assigned':
        return <DriverStartDayScreen showNoAssignment={false} />;
      case 'driver-unassigned':
        return <DriverStartDayScreen showNoAssignment={true} />;
      case 'staff-assigned':
        return <StaffStartDayScreen showNoAssignment={false} />;
      case 'staff-unassigned':
        return <StaffStartDayScreen showNoAssignment={true} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveScreen(tab.key)}
              style={[
                styles.tab,
                activeScreen === tab.key && styles.tabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeScreen === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Screen Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#1A237E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#616161',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});
