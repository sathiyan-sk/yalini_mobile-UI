/**
 * 4-digit PIN field — pixel match for the design.
 *
 * Renders a single TextInput visually styled as 4 dashes when the value
 * is hidden, or as the typed digits when \"Show\" is toggled. Tapping the
 * row focuses the underlying input. Right-aligned \"Show / Hide\" toggle.
 */
import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { authColors } from "../../theme";

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  editable?: boolean;
  onSubmitEditing?: () => void;
}

const PIN_LENGTH = 4;

export function PinField({
  value,
  onChangeText,
  editable = true,
  onSubmitEditing,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const focusInput = () => {
    if (editable) inputRef.current?.focus();
  };

  return (
    <View testID="login-pin-field">
      <Text style={styles.label}>Passcode (PIN)</Text>
      <Pressable
        onPress={focusInput}
        style={[styles.box, focused && styles.boxFocused]}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="lock-closed" size={22} color={authColors.yellow} />
        </View>

        {/* Hidden input — captures keystrokes */}
        <TextInput
          ref={inputRef}
          testID="login-pin-input"
          value={value}
          onChangeText={(t) =>
            onChangeText(t.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH))
          }
          keyboardType="number-pad"
          maxLength={PIN_LENGTH}
          secureTextEntry={!show}
          returnKeyType="done"
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.hiddenInput}
          caretHidden
        />

        {/* Visible digit slots */}
        <View style={styles.slots} pointerEvents="none">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const char = value[i];
            const filled = Boolean(char);
            return (
              <View key={i} style={styles.slot}>
                {filled ? (
                  <Text style={styles.slotChar}>{show ? char : "•"}</Text>
                ) : (
                  <View style={styles.slotDash} />
                )}
              </View>
            );
          })}
        </View>

        <Pressable
          testID="login-pin-toggle"
          hitSlop={8}
          onPress={() => setShow((s) => !s)}
          style={styles.toggleWrap}
        >
          <Text style={styles.toggleText}>{show ? "Hide" : "Show"}</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: authColors.heading,
    marginBottom: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: authColors.fieldBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: authColors.fieldBorderSoft,
    paddingHorizontal: 12,
    shadowColor: authColors.fieldShadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  boxFocused: {
    borderColor: authColors.yellowBorder,
  },
  iconWrap: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  slots: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 4,
  },
  slot: {
    flex: 1,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  slotDash: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: authColors.pinDash,
  },
  slotChar: {
    fontSize: 22,
    fontWeight: "700",
    color: authColors.heading,
    lineHeight: 24,
  },
  toggleWrap: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "700",
    color: authColors.heading,
  },
});
