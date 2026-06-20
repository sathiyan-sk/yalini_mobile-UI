/**
 * AddTripScreen - Screen to add a new trip in Driver module
 * Allows driver to enter trip details: From, To, Amount, Payment Mode
 * Follows the design specifications with pixel-perfect implementation
 */

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { colors, spacing } from "../../../theme";
import {
  AddTripHeader,
  ServiceInfoCard,
  TripDetailsForm,
  InfoNote,
} from "../AddTrip/components";
import type { TripFormData, PaymentMode } from "../../../types/driver";

// Mock session data - In real app, this would come from context/store
const MOCK_SESSION_DATA = {
  serviceName: "City Taxi Service",
  driverName: "Ramesh Kumar",
  vehicleNumber: "TN 01 AB 1234",
  sessionStatus: "Day Started" as const,
  sessionDate: "10 May 2024",
  sessionTime: "08:05 AM",
};

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function AddTripScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    from: "",
    to: "",
    amount: "",
    paymentMode: "cash",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handlers
  const handleFromChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, from: value }));
  }, []);

  const handleToChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, to: value }));
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({ ...prev, amount: sanitized }));
  }, []);

  const handlePaymentModeChange = useCallback((mode: PaymentMode) => {
    setFormData((prev) => ({ ...prev, paymentMode: mode }));
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHelpPress = useCallback(() => {
    Alert.alert(
      "Help",
      "Enter your trip details including pickup location, drop location, fare amount, and payment method. Click Save Trip to record your trip."
    );
  }, []);

  const handleSaveTrip = useCallback(async () => {
    // Validation
    if (!formData.from.trim()) {
      Alert.alert("Error", "Please enter pickup location");
      return;
    }
    if (!formData.to.trim()) {
      Alert.alert("Error", "Please enter drop location");
      return;
    }
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success and navigate back
      Alert.alert("Success", "Trip saved successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({
              from: "",
              to: "",
              amount: "",
              paymentMode: "cash",
            });
            // Navigate to AllTrips or stay on screen based on requirement
            // navigation.navigate("AllTrips");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <AddTripHeader
          onBackPress={handleBackPress}
          onHelpPress={handleHelpPress}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 }, // Extra padding for tab bar
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Service Info Card */}
          <ServiceInfoCard
            serviceName={MOCK_SESSION_DATA.serviceName}
            driverName={MOCK_SESSION_DATA.driverName}
            vehicleNumber={MOCK_SESSION_DATA.vehicleNumber}
            sessionStatus={MOCK_SESSION_DATA.sessionStatus}
            sessionDate={MOCK_SESSION_DATA.sessionDate}
            sessionTime={MOCK_SESSION_DATA.sessionTime}
          />

          {/* Trip Details Form */}
          <TripDetailsForm
            formData={formData}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
            onAmountChange={handleAmountChange}
            onPaymentModeChange={handlePaymentModeChange}
            onSaveTrip={handleSaveTrip}
            isSubmitting={isSubmitting}
          />

          {/* Info Note */}
          <InfoNote />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
