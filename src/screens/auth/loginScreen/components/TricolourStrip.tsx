/**
 * Indian tricolour strip — saffron / white / green with subtle gradient softening.
 *
 * Anchored just below the cream login card to echo the brand identity.
 * Kept dependency-free (3 plain Views).
 */
import React from "react";
import { StyleSheet, View } from "react-native";

import { authColors } from "../../theme";

export function TricolourStrip() {
  return (
    <View pointerEvents="none" style={styles.row} testID="login-tricolour">
      <View style={[styles.stripe, { backgroundColor: authColors.saffron }]} />
      <View style={[styles.stripe, { backgroundColor: authColors.white }]} />
      <View style={[styles.stripe, { backgroundColor: authColors.green }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    height: 6,
    opacity: 0.4,
  },
  stripe: {
    flex: 1,
  },
});
