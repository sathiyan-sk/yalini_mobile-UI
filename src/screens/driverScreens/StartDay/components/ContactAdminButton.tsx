/**
 * ContactAdminButton - Secondary outlined button with phone icon
 */
import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ContactAdminButtonProps {
  onPress: () => void;
}

const PRIMARY_BLUE = '#1976D2';

export function ContactAdminButton({ onPress }: ContactAdminButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Feather name="phone" size={20} color={PRIMARY_BLUE} />
      <Text style={styles.text}>Contact Admin</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 10,
    minHeight: 48,
  },
  pressed: {
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: PRIMARY_BLUE,
  },
});
