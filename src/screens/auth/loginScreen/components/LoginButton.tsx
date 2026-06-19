/**
 * Primary CTA button used on the Login form.
 *
 * Solid amber surface with a subtle pressed state, white centered label
 * and a trailing arrow indicator — matches the design spec.
 */
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { authColors } from "../../theme";

interface Props {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

export function LoginButton({
  onPress,
  loading = false,
  disabled = false,
  label = "Login",
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      testID="login-submit-button"
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        pressed && !isDisabled && styles.btnPressed,
        isDisabled && styles.btnDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={authColors.ctaText} />
      ) : (
        <>
          <View style={styles.spacer} />
          <Text style={styles.label}>{label}</Text>
          <View style={styles.arrowWrap}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={authColors.ctaText}
            />
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    backgroundColor: authColors.yellow,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowColor: authColors.yellowDeep,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  btnPressed: {
    backgroundColor: authColors.yellowDeep,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  spacer: {
    width: 20,
  },
  label: {
    flex: 1,
    textAlign: "center",
    color: authColors.ctaText,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  arrowWrap: {
    width: 20,
    alignItems: "flex-end",
  },
});
