/**
 * StartDayHeader - Dark navy header with menu icon and title
 */
import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StartDayHeaderProps {
  title?: string;
  onMenuPress?: () => void;
}

const HEADER_BG = '#1A237E';

export function StartDayHeader({ 
  title = 'Start Day', 
  onMenuPress 
}: StartDayHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0 }]}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />
      <View style={styles.content}>
        <Pressable
          onPress={onMenuPress}
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Feather name="menu" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_BG,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
});
