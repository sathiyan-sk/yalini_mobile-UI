import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DailyRecordsScreen from "../screens/adminScreens/Records/DailyRecordsScreen";
import RecordDetailsScreen from "../screens/adminScreens/Records/RecordDetailsScreen";
import WaterRecordDetailsScreen from "../screens/adminScreens/Records/components/dailyRecords/WaterRecordDetailsScreen";
import type { DailyRecordsStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<DailyRecordsStackParamList>();

/**
 * Navigator for the Daily Records tab.
 * Contains DailyRecordsList as entry point and RecordDetails for viewing individual records.
 */
export default function DailyRecordsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,}}
      >
      <Stack.Screen name="DailyRecordsList" component={DailyRecordsScreen} />
      <Stack.Screen name="RecordDetails" component={RecordDetailsScreen} />
      <Stack.Screen name="WaterRecordDetails" component={WaterRecordDetailsScreen} />
    </Stack.Navigator>
  );
}
