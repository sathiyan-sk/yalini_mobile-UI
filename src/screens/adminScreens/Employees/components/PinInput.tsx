import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  testID: string;
}

/**
 * 4-digit PIN input with visibility toggle.
 */
export function PinInput({
  value,
  onChange,
  label,
  placeholder = "Enter 4-digit PIN",
  error,
  testID,
}: PinInputProps) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    // Only allow digits and max 4 characters
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    onChange(cleaned);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <View style={styles.iconWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
        </View>
        <TextInput
          ref={inputRef}
          testID={testID}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry={!visible}
          autoCorrect={false}
        />
        <Pressable
          testID={`${testID}-toggle`}
          onPress={() => setVisible(!visible)}
          hitSlop={8}
          style={styles.eyeButton}
        >
          <Ionicons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={22}
            color={colors.textTertiary}
          />
        </Pressable>
      </View>
      {error ? (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  iconWrap: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
