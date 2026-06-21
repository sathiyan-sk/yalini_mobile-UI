/**
 * HomeHeader - Dark navy header with avatar, greeting, and notification bell
 * Pixel-perfect match to design specifications
 */
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, spacing } from "../../../../theme";

interface HomeHeaderProps {
  driverName: string;
  greeting: string;
  onLogout: () => void;
}

const HEADER_BG = colors.headerDark;

export function HomeHeader({
  driverName,
  greeting,
  onLogout,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  // Extract first name from full name
  const DriverFirstName = driverName.split(" ")[0];

  return (
    <LinearGradient
      colors={[colors.avatarOrange, '#a5b753ee']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.driverName}>{DriverFirstName}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  driverName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});