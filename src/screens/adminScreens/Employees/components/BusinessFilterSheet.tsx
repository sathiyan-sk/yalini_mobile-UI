import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { EmployeeBusinessFilter } from "../types";
import type { Business } from "../../MyBusiness/types";

interface BusinessFilterSheetProps {
  visible: boolean;
  value: EmployeeBusinessFilter;
  businesses: Business[];
  onSelect: (next: EmployeeBusinessFilter) => void;
  onClose: () => void;
}

/**
 * Bottom-sheet picker for filtering employees by business.
 */
export function BusinessFilterSheet({
  visible,
  value,
  businesses,
  onSelect,
  onClose,
}: BusinessFilterSheetProps) {
  const options: { id: EmployeeBusinessFilter; label: string }[] = [
    { id: "all", label: "All Businesses" },
    ...businesses.map((b) => ({ id: b.id, label: b.name })),
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filter by Business</Text>
          {options.map((option) => {
            const selected = value === option.id;
            return (
              <Pressable
                key={option.id}
                testID={`business-filter-option-${option.id}`}
                onPress={() => onSelect(option.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    selected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {selected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.brand}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    maxHeight: "60%",
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionSelected: {
    backgroundColor: colors.brandSoft,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  optionLabel: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.brand,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
