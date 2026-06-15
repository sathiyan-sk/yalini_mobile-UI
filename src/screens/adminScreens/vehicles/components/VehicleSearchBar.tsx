import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../theme";
import type { VehicleStatusFilter } from "../../../../types/vehicle";

interface VehicleSearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
  filter: VehicleStatusFilter;
  onOpenFilter: () => void;
  testID?: string;
}

export function VehicleSearchBar({
  query,
  onQueryChange,
  onOpenFilter,
  testID,
}: VehicleSearchBarProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder="Search by vehicle name or number..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={onQueryChange}
          autoCapitalize="none"
          autoCorrect={false}
          testID={`${testID}-input`}
        />
      </View>
      <Pressable
        onPress={onOpenFilter}
        style={({ pressed }) => [
          styles.filterButton,
          pressed && styles.filterButtonPressed,
        ]}
        testID={`${testID}-filter`}
      >
        <Feather name="filter" size={20} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    height: 48,
    ...cardShadow,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  filterButtonPressed: {
    opacity: 0.8,
  },
});
