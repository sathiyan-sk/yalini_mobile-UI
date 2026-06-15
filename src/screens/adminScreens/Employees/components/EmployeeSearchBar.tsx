import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { EmployeeBusinessFilter } from "../types";
import type { Business } from "../../MyBusiness/types";

interface EmployeeSearchBarProps {
  query: string;
  onQueryChange: (next: string) => void;
  businessFilter: EmployeeBusinessFilter;
  businesses: Business[];
  onOpenFilter: () => void;
  testID?: string;
}

/**
 * Search field + business filter pill rendered below the stat cards.
 */
export function EmployeeSearchBar({
  query,
  onQueryChange,
  businessFilter,
  businesses,
  onOpenFilter,
  testID,
}: EmployeeSearchBarProps) {
  const getFilterLabel = () => {
    if (businessFilter === "all") return "All Businesses";
    const business = businesses.find((b) => b.id === businessFilter);
    return business?.name ?? "All Businesses";
  };

  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.searchBox}>
        <Feather name="search" size={16} color={colors.textTertiary} />
        <TextInput
          testID="employee-search-input"
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search by name or mobile number"
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <Pressable
        testID="employee-filter-button"
        onPress={onOpenFilter}
        accessibilityRole="button"
        accessibilityLabel="Filter employees by business"
        style={({ pressed }) => [styles.filterPill, pressed && styles.pressed]}
      >
        <Ionicons name="filter" size={16} color={colors.textSecondary} />
        <Text style={styles.filterLabel} numberOfLines={1}>
          {getFilterLabel()}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.textSecondary} />
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
    minHeight: 44,
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
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    minWidth: 130,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
