/**
 * AddTripHeader - Dark navy header for Add Trip screen
 * Contains back button, title, subtitle, and help icon
 */

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { colors, spacing, fontSize, radius } from "../../../../theme";

interface AddTripHeaderProps {
  onBackPress: () => void;
  onHelpPress: () => void;
}

export function AddTripHeader({ onBackPress, onHelpPress }: AddTripHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerDark} />
      
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={28} color={colors.surface} />
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Add Trip</Text>
          <Text style={styles.subtitle}>Enter trip details and save</Text>
        </View>

        {/* Help Button */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={onHelpPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <View style={styles.helpIconContainer}>
            <Feather name="help-circle" size={24} color={colors.surface} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerDark,
    paddingBottom: spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleSection: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.surface,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  helpIconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
