import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WaterDailyRecordsScreen from "../screens/adminScreens/Records/components/dailyRecords/WaterDailyRecordsScreen";
import WaterRecordDetailsScreen from "../screens/adminScreens/Records/components/dailyRecords/WaterRecordDetailsScreen";
import type { WaterRecordsStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<WaterRecordsStackParamList>();

/**
 * Navigator for the Water Records tab.
 * Contains WaterRecordsList as entry point and WaterRecordDetails for viewing individual records.
 */
export default function WaterRecordsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WaterRecordsList" component={WaterDailyRecordsScreen} />
      <Stack.Screen name="WaterRecordDetails" component={WaterRecordDetailsScreen} />
    </Stack.Navigator>
  );
}
