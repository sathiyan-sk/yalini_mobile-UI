import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../theme";
import { BusinessModeSelector } from "./components/BusinessModeSelector";
import { BusinessTypeSelector } from "./components/BusinessTypeSelector";
import { FormField } from "./components/FormField";
import { HowItWorksNote } from "./components/HowItWorksNote";
import {
  DEFAULT_BUSINESS_TYPE,
  getBusinessType,
} from "./data/businessTypes";
import type {
  BusinessMode,
  BusinessTypeId,
  CreateBusinessInput,
  UpdateBusinessInput,
} from "./types";

const DESCRIPTION_LIMIT = 120;
const NAME_LIMIT = 50;

export interface BusinessFormValues {
  name: string;
  type: BusinessTypeId;
  mode: BusinessMode;
  description: string;
}

export interface BusinessFormErrors {
  name?: string;
  mode?: string;
}

interface BusinessFormProps {
  /** Initial form values — passed from Add (defaults) or Edit (existing record). */
  initialValues: BusinessFormValues;
  /**
   * Edit mode locks the business type once a record is created, hides the
   * \"How it works?\" info note, swaps the primary CTA label and shows a
   * single-page card layout. The Add screen leaves all of these enabled.
   */
  mode: "create" | "edit";
  submitting: boolean;
  /** Resolves with the typed payload once validation passes. */
  onSubmit: (
    values: CreateBusinessInput | UpdateBusinessInput,
  ) => Promise<void> | void;
  onCancel: () => void;
}

/**
 * Shared business form used by both Add Business and Edit Business.
 *
 * Pure controlled component — owns the working draft + per-field
 * validation, hands a validated payload to `onSubmit` and lets the
 * parent screen handle persistence / navigation. Keeping the form here
 * means the two screens stay thin and the validation rules live in a
 * single place.
 */
export function BusinessForm({
  initialValues,
  mode,
  submitting,
  onSubmit,
  onCancel,
}: BusinessFormProps) {
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState<BusinessFormValues>(initialValues);
  const [errors, setErrors] = useState<BusinessFormErrors>({});

  const typeDef = useMemo(() => getBusinessType(values.type), [values.type]);

  const updateField = useCallback(
    <Key extends keyof BusinessFormValues>(
      key: Key,
      next: BusinessFormValues[Key],
    ) => {
      setValues((prev) => ({ ...prev, [key]: next }));
      if (key === "name") {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
      if (key === "mode") {
        setErrors((prev) => ({ ...prev, mode: undefined }));
      }
    },
    [],
  );

  const validate = (): BusinessFormErrors => {
    const next: BusinessFormErrors = {};
    if (!values.name.trim()) next.name = "Business name is required";
    if (values.name.trim().length > NAME_LIMIT) {
      next.name = `Keep it under ${NAME_LIMIT} characters`;
    }
    if (values.mode !== "auto" && values.mode !== "manual") {
      next.mode = "Pick a business mode";
    }
    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (mode === "edit") {
      const payload: UpdateBusinessInput = {
        name: values.name,
        mode: values.mode,
        description: values.description,
      };
      await onSubmit(payload);
    } else {
      const payload: CreateBusinessInput = {
        name: values.name,
        type: values.type ?? DEFAULT_BUSINESS_TYPE,
        mode: values.mode,
        description: values.description,
      };
      await onSubmit(payload);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
    >
      <ScrollView
        testID={`business-form-${mode}-scroll`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
      >
        {/* Business Name */}
        <View style={styles.card}>
          <FormField
            label="Business Name"
            required
            error={errors.name}
            testID="business-form-name"
          >
            <TextInput
              testID="business-form-name-input"
              value={values.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Enter business name"
              placeholderTextColor={colors.textTertiary}
              maxLength={NAME_LIMIT}
              style={styles.input}
              returnKeyType="next"
            />
          </FormField>
        </View>

        {/* Business Type */}
        <View style={styles.card}>
          <FormField
            label="Business Type"
            required={mode === "create"}
            helper={
              mode === "create" ? "Select the type of business" : undefined
            }
            testID="business-form-type"
          >
            <BusinessTypeSelector
              value={values.type}
              onChange={(next) => updateField("type", next)}
              locked={mode === "edit"}
            />
          </FormField>
        </View>

        {/* Business Mode */}
        <View style={styles.card}>
          <FormField
            label="Business Mode"
            required
            helper="Choose how employees will select their business assets"
            error={errors.mode}
            testID="business-form-mode"
          >
            <BusinessModeSelector
              value={values.mode}
              onChange={(next) => updateField("mode", next)}
              assetNoun={typeDef.assetNoun}
            />
          </FormField>

          {mode === "create" ? (
            <View style={styles.noteBlock}>
              <HowItWorksNote />
            </View>
          ) : null}
        </View>

        {/* Description — only on Add per the reference design */}
        {mode === "create" ? (
          <View style={styles.card}>
            <FormField
              label="Description"
              helper="(Optional)"
              testID="business-form-description"
            >
              <View style={styles.textareaWrapper}>
                <TextInput
                  testID="business-form-description-input"
                  value={values.description}
                  onChangeText={(text) =>
                    updateField("description", text.slice(0, DESCRIPTION_LIMIT))
                  }
                  placeholder="Enter description about this business"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  textAlignVertical="top"
                  style={styles.textarea}
                />
                <Text style={styles.counter} testID="business-form-description-counter">
                  {values.description.length}/{DESCRIPTION_LIMIT}
                </Text>
              </View>
            </FormField>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            testID="business-form-submit-button"
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              submitting && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {submitting
                ? mode === "edit"
                  ? "Saving..."
                  : "Saving..."
                : mode === "edit"
                ? "Save Changes"
                : "Save Business"}
            </Text>
          </Pressable>

          <Pressable
            testID="business-form-cancel-button"
            onPress={onCancel}
            disabled={submitting}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  textareaWrapper: {
    position: "relative",
  },
  textarea: {
    minHeight: 96,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  counter: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.sm,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  noteBlock: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryButton: {
    backgroundColor: "#1D4ED8",
    borderRadius: radius.md,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonText: {
    color: "#0B1F3F",
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
});