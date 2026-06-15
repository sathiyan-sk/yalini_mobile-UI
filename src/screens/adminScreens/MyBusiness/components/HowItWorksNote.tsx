import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontSize, radius, spacing } from "../../../../theme";

/**
 * Inline informational note shown under the business-mode selector on the
 * Add Business screen.
 *
 * Soft blue surface to reassure the user the choice isn't permanent —
 * matches the \"How it works?\" copy in the reference design.
 */
export function HowItWorksNote() {
  return (
    <View style={styles.container} testID="how-it-works-note">
      <Ionicons
        name="information-circle"
        size={20}
        color="#2563EB"
        style={styles.icon}
      />
      <View style={styles.copyBlock}>
        <Text style={styles.title}>How it works?</Text>
        <Text style={styles.body}>
          You can change this mode anytime from business settings after
          creating the business.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: "#EFF6FF",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  icon: {
    marginTop: 1,
  },
  copyBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  body: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    color: "#1E3A8A",
  },
});