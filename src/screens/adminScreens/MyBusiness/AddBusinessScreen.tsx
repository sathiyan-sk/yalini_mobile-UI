import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MoreStackParamList } from "../../../navigation/types";
import { businessService } from "../../../services/businessService";
import { colors } from "../../../theme";

import { BusinessForm, type BusinessFormValues } from "./BusinessForm";
import { FormHeader } from "./components/FormHeader";
import { DEFAULT_BUSINESS_TYPE } from "./data/businessTypes";
import type { CreateBusinessInput } from "./types";

type AddBusinessNavigationProp = NativeStackNavigationProp<MoreStackParamList,"AddBusiness">;

const INITIAL_VALUES: BusinessFormValues = {
  name: "",
  type: DEFAULT_BUSINESS_TYPE,
  mode: "auto",
  description: "",
};

/**
 * Admin → Add Business screen.
 *
 * Wraps the shared `BusinessForm` in `mode=\"create\"`, hands off
 * persistence to `businessService.create`, and pops back to the listing
 * once the write resolves. The listing rehydrates itself via
 * `useFocusEffect`, so we don't need to pass any payload back through
 * navigation params.
 */
export default function AddBusinessScreen() {
  const navigation = useNavigation<AddBusinessNavigationProp>();
  const [submitting, setSubmitting] = useState(false);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(
    async (payload: CreateBusinessInput) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await businessService.create(payload);
        navigation.goBack();
      } finally {
        setSubmitting(false);
      }
    },
    [navigation, submitting],
  );

  return (
    <View style={styles.container} testID="add-business-screen">
      <FormHeader
        title="Add Business"
        subtitle="Create a new business and configure settings"
        onBackPress={handleBack}
        testID="add-business-header"
      />
      <BusinessForm
        mode="create"
        initialValues={INITIAL_VALUES}
        submitting={submitting}
        onSubmit={(payload) =>
        handleSubmit(payload as CreateBusinessInput)
        }
        onCancel={handleBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
});