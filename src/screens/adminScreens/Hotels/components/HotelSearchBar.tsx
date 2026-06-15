import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";

interface HotelSearchBarProps {
  query: string;
  onQueryChange: (next: string) => void;
  onOpenFilter: () => void;
  testID?: string;
}

/**
 * Search field + filter button rendered below the stat cards.
 *
 * Both controls live on a single horizontal row matching the design.
 */
export function HotelSearchBar({
  query,
  onQueryChange,
  onOpenFilter,
  testID,
}: HotelSearchBarProps) {
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color={colors.textTertiary} />
        <TextInput
          testID="hotel-search-input"
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search by hotel name..."
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <Pressable
        testID="hotel-filter-button"
        onPress={onOpenFilter}
        accessibilityRole="button"
        accessibilityLabel="Filter hotels by status"
        style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
      >
        <Feather name="filter" size={20} color={colors.brand} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
