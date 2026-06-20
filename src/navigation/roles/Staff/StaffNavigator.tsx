/**
 * Staff module navigator — shows the Start Day screen and future staff screens.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StaffStartDayScreen from "../../../screens/staffScreens/StartDay/StaffStartDayScreen";

const Stack = createNativeStackNavigator();

export default function StaffNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffStartDay" component={StaffStartDayScreen} />
    </Stack.Navigator>
  );
}
