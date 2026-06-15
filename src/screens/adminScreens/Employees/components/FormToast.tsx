import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface FormToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  testID?: string;
}

/**
 * Success toast that slides in from the top after form submission.
 */
export function FormToast({
  visible,
  message,
  onHide,
  testID,
}: FormToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.delay(1500),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible, translateY, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.toast, { transform: [{ translateY }] }]}
      testID={testID}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success,
  },
  iconWrap: {},
  message: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.success,
  },
});
