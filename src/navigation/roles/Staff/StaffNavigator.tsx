/**
 * StaffNavigator — root navigator for STAFF role.
 *
 * Flow:
 *   StartDay (Stack) → shown when no active session
 *   Main (Bottom Tabs) → shown when session is active
 *   SubmittedSuccessfully → shown after successful day submission
 *
 * Stack:
 *   StaffStartDay → StaffStartDayScreen
 *   StaffMain     → StaffTabBar (bottom tabs)
 *   SubmittedSuccessfully → Success screen after submission
 *
 * Navigation:
 *   After starting session → navigate to StaffMain
 *   Session submitted      → navigate to SubmittedSuccessfully
 *   Start new day          → reset to StaffStartDay
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StaffStartDayScreen from "../../../screens/staffScreens/StartDay/StaffStartDayScreen";
import StaffTabBar from "./StaffTabBar";

export type StaffStackParamList = {
  StaffStartDay: undefined;
  StaffMain: undefined;
  SubmittedSuccessfully: undefined;
};

const Stack = createNativeStackNavigator<StaffStackParamList>();

export default function StaffNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="StaffStartDay"
        component={StaffStartDayScreen}
      />
      <Stack.Screen
        name="StaffMain"
        component={StaffTabBar}
      />
    </Stack.Navigator>
  );
}
