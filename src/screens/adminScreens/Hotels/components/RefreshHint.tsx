import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";

interface RefreshHintProps {
  testID?: string;
}

/**
 * "Swipe down to refresh" hint shown at the bottom of the list.
 */
export function RefreshHint({ testID }: RefreshHintProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Feather name="chevron-down" size={18} color={colors.textTertiary} />
      <Text style={styles.text}>Swipe down to refresh</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
});
