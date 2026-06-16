import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface AssignmentHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  testID?: string;
}

export function AssignmentHeader({
  title,
  subtitle,
  onBack,
  testID,
}: AssignmentHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
      testID={testID}
    >
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`${testID}-back-button`}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
    borderRadius: radius.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
