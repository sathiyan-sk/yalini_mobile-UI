/**
 * StartDayButton - Primary blue button with play icon
 */
import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface StartDayButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const PRIMARY_BLUE = '#2979FF';

export function StartDayButton({ onPress, disabled = false }: StartDayButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Feather name="play" size={22} color="#FFFFFF" />
      <Text style={styles.text}>Start Day</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_BLUE,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 10,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: '#BDBDBD',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
