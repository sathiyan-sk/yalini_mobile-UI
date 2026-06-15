import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MoreStackParamList } from "../../../navigation/types";
import { businessService } from "../../../services/businessService";
import { colors, fontSize, spacing } from "../../../theme";

import { BusinessForm, type BusinessFormValues } from "./BusinessForm";
import { FormHeader } from "./components/FormHeader";
import type { BusinessRecord, UpdateBusinessInput } from "./types";

type EditBusinessNavigationProp = NativeStackNavigationProp<
  MoreStackParamList,
  "EditBusiness"
>;
type EditBusinessRouteProp = RouteProp<MoreStackParamList, "EditBusiness">;

/**
 * Admin → Edit Business screen.
 *
 * Fetches the targeted record on mount (param `businessId`), then mounts
 * the shared `BusinessForm` with `mode="edit"`. In edit mode the type
 * field is locked (changing it would invalidate existing employee asset
 * assignments) and the "Save Changes" CTA persists name + mode +
 * description via `businessService.update`.
 *
 * Loading and not-found are both handled inline so the screen never
 * shows a half-populated form.
 */
export default function EditBusinessScreen() {
  const navigation = useNavigation<EditBusinessNavigationProp>();
  const route = useRoute<EditBusinessRouteProp>();
  const { businessId } = route.params;

  const [record, setRecord] = useState<BusinessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await businessService.getById(businessId);
      if (cancelled) return;
      if (!result) {
        setNotFound(true);
      } else {
        setRecord(result);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(
    async (payload: UpdateBusinessInput) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await businessService.update(businessId, payload);
        navigation.goBack();
      } finally {
        setSubmitting(false);
      }
    },
    [businessId, navigation, submitting],
  );

  return (
    <View style={styles.container} testID="edit-business-screen">
      <FormHeader
        title="Edit Business"
        subtitle="Update your business configuration"
        onBackPress={handleBack}
        testID="edit-business-header"
      />

      {loading ? (
        <View style={styles.centerState} testID="edit-business-loading">
          <ActivityIndicator color="#1D4ED8" />
        </View>
      ) : notFound || !record ? (
        <View style={styles.centerState} testID="edit-business-not-found">
          <Text style={styles.notFoundTitle}>Business not found</Text>
          <Text style={styles.notFoundBody}>
            It might have been removed. Pull back to the list and try again.
          </Text>
        </View>
      ) : (
        <BusinessForm
          mode="edit"
          submitting={submitting}
          initialValues={buildFormValues(record)}
          onSubmit={(payload) => handleSubmit(payload as UpdateBusinessInput)}
          onCancel={handleBack}
        />
      )}
    </View>
  );
}

function buildFormValues(record: BusinessRecord): BusinessFormValues {
  return {
    name: record.name,
    type: record.type,
    mode: record.mode,
    description: record.description,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  notFoundTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  notFoundBody: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
});