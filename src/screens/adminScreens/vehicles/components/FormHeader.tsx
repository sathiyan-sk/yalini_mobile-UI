import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { fontSize, spacing } from "../../../../theme";
import { FORM_HEADER_BG } from "../../../../data/vehicleConstants";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  topInset: number;
  testID?: string;
}

export function FormHeader({
  title,
  subtitle,
  onBack,
  topInset,
  testID,
}: FormHeaderProps) {
  return (
    <View style={[styles.container, { paddingTop: topInset + spacing.md }]} testID={testID}>
      <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
        <Feather name="arrow-left" size={24} color={"#FFFFFF"} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: FORM_HEADER_BG,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: fontSize.base,
    color: "rgba(255,255,255,0.7)",
    marginTop: spacing.xs,
  },
});
