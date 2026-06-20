/**
 * InfoNote - Info message component shown below the form
 * Displays helpful information about what happens after saving
 */

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, spacing, fontSize, radius } from "../../../../theme";

export function InfoNote() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="info" size={18} color={colors.primaryBlue} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          After saving, you can add expenses{"\n"}for this trip from All Trips screen.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E3F2FD",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: "rgba(30, 136, 229, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
