/**
 * Lightweight inline toast — animates in from the top of the safe area.
 *
 * Used by `LoginScreen` to surface validation + auth errors and the
 * \"Driver module coming soon\" gate without an Alert.* call.
 */
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authColors } from "../../theme";

type ToneKind = "error" | "info" | "success";

interface Props {
  message: string;
  tone?: ToneKind;
  onDismiss: () => void;
  duration?: number;
}

const TONE_STYLES: Record<
  ToneKind,
  { bg: string; border: string; iconColor: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  error: {
    bg: authColors.errorSoft,
    border: authColors.error,
    iconColor: authColors.error,
    icon: "alert-circle",
  },
  info: {
    bg: "#E8F1FF",
    border: "#2D6BE8",
    iconColor: "#2D6BE8",
    icon: "information-circle",
  },
  success: {
    bg: "#E6F8EE",
    border: "#138808",
    iconColor: "#138808",
    icon: "checkmark-circle",
  },
};

export function LoginToast({
  message,
  tone = "error",
  onDismiss,
  duration = 3200,
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 14,
        stiffness: 140,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss, opacity, translateY]);

  const palette = TONE_STYLES[tone];

  return (
    <Animated.View
      pointerEvents="box-none"
      testID="login-toast"
      style={[
        styles.wrap,
        {
          top: insets.top + 8,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Pressable onPress={onDismiss} style={[styles.card, { backgroundColor: palette.bg, borderColor: palette.border }]}>
        <Ionicons name={palette.icon} size={20} color={palette.iconColor} />
        <Text style={[styles.msg, { color: palette.iconColor }]} numberOfLines={3}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 50,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#101828",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  msg: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
});
