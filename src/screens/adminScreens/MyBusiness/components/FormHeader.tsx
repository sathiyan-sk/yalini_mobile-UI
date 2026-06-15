import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontSize, spacing } from "../../../../theme";

const HEADER_BG = "#0F1F47";
const HEADER_SUBTITLE = "#C7D2EF";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  onBackPress: () => void;
  testID?: string;
}

/**
 * Compact navy header shared by the Add Business and Edit Business screens.
 *
 * Mirrors the listing header chrome (same navy surface + safe-area aware
 * top padding) but swaps the right-side CTA for a small back chevron so
 * the form screens read as a \"drill-in\" from the listing.
 */
export function FormHeader({
  title,
  subtitle,
  onBackPress,
  testID,
}: FormHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.sm }]}
      testID={testID}
    >
      <View style={styles.row}>
        <Pressable
          testID={`${testID}-back-button`}
          onPress={onBackPress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    color: HEADER_SUBTITLE,
    fontSize: fontSize.base,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.7,
  },
});