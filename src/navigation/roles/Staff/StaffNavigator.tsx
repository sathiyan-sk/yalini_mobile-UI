/**
 * Staff module navigator — placeholder until the Staff experience ships.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PlaceholderScreen } from "../../../screens/PlaceholderScreen";

const Stack = createNativeStackNavigator();

function StaffHome() {
  return (
    <PlaceholderScreen
      title="Staff"
      icon="user"
      description="The Staff module is coming soon."
      testID="staff-placeholder"
    />
  );
}

export default function StaffNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffHome" component={StaffHome} />
    </Stack.Navigator>
  );
}
