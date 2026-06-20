/**
 * Driver module navigator — shows the Start Day screen and future driver screens.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DriverStartDayScreen from "../../../screens/driverScreens/StartDay/StartDayScreen";

const Stack = createNativeStackNavigator();

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverStartDay" component={DriverStartDayScreen} />
    </Stack.Navigator>
  );
}
