/**
 * AddExpenseScreen - Screen to add expenses for a trip in Driver module
 * Allows driver to enter expense details: Fuel, Toll, Food, Other
 * Follows the design specifications with pixel-perfect implementation
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing } from '../../../theme';
import {
  AddExpenseHeader,
  TripInfoCard,
  ExpenseDetailsCard,
  NotesSection,
  ActionButtons,
} from './components';
import { MOCK_TRIP_DATA, EXPENSE_CATEGORIES, INITIAL_EXPENSE_FORM } from './data/mockData';
import type { ExpenseFormData, ExpenseField } from '../../../types/driver';

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function AddExpenseScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState<ExpenseFormData>(INITIAL_EXPENSE_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total expense
  const totalExpense = useMemo(() => {
    const fuel = parseFloat(formData.fuel) || 0;
    const toll = parseFloat(formData.toll) || 0;
    const food = parseFloat(formData.food) || 0;
    const other = parseFloat(formData.other) || 0;
    return fuel + toll + food + other;
  }, [formData]);

  // Form handlers
  const handleFieldChange = useCallback((field: ExpenseField, value: string) => {
    // Only allow numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
  }, []);

  const handleNotesChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, notes: value }));
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHelpPress = useCallback(() => {
    Alert.alert(
      'Help',
      'Enter your expense details for this trip. You can add fuel, toll, food, and other expenses. The total will be calculated automatically.'
    );
  }, []);

  const handleSaveExpense = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success and navigate
      Alert.alert('Success', 'Expense saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData(INITIAL_EXPENSE_FORM);
            // Navigate back or to AllTrips
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigation]);

  const handleSkipExpense = useCallback(() => {
    Alert.alert(
      'Skip Expense',
      'Are you sure you want to skip adding expenses? You can add them later from All Trips.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <AddExpenseHeader
          onBackPress={handleBackPress}
          onHelpPress={handleHelpPress}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Trip Info Card */}
          <TripInfoCard tripData={MOCK_TRIP_DATA} />

          {/* Expense Details Card */}
          <ExpenseDetailsCard
            categories={EXPENSE_CATEGORIES}
            formData={formData}
            onFieldChange={handleFieldChange}
            totalExpense={totalExpense}
          />

          {/* Notes Section */}
          <NotesSection
            notes={formData.notes}
            onNotesChange={handleNotesChange}
          />

          {/* Action Buttons */}
          <ActionButtons
            onSaveExpense={handleSaveExpense}
            onSkipExpense={handleSkipExpense}
            isSubmitting={isSubmitting}
          />
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
