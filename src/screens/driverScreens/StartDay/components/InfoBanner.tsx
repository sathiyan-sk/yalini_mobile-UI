/**
 * InfoBanner - Shows informational message with light blue background
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InfoBannerProps {
  message: string;
}

const INFO_BG = '#E3F2FD';
const INFO_ICON_COLOR = '#1976D2';

export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="info" size={20} color={INFO_ICON_COLOR} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: INFO_BG,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 1,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
});
