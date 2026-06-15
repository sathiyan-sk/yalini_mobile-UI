import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, spacing } from "../../../../theme";

interface FormFieldProps {
  /** Field label, e.g. \"Business Name\". */
  label: string;
  /** When true, appends a red \"*\" glyph after the label. */
  required?: boolean;
  /** Optional helper line drawn under the label (\"Select the type of...\"). */
  helper?: string;
  /** Error message rendered under the children when validation fails. */
  error?: string;
  /** Form control (TextInput, selector, etc.) — provided by the caller. */
  children: React.ReactNode;
  testID?: string;
}

/**
 * Generic label + helper + control + error wrapper used by every field on
 * the Add / Edit Business screens.
 *
 * Keeps the spacing and typography consistent across the form so each
 * screen only has to wire the actual control (TextInput, selectors, etc.).
 */
export function FormField({
  label,
  required = false,
  helper,
  error,
  children,
  testID,
}: FormFieldProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required ? <Text style={styles.required}> *</Text> : null}
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      <View style={styles.controlBlock}>{children}</View>
      {error ? (
        <Text style={styles.error} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  required: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#DC2626",
  },
  helper: {
    marginTop: 4,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  controlBlock: {
    marginTop: spacing.sm,
  },
  error: {
    marginTop: 6,
    fontSize: fontSize.sm,
    color: "#DC2626",
  },
});