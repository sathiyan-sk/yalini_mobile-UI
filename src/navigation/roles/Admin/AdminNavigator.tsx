import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AppTabBar } from "../../AppTabBar";
import type { RootTabParamList } from "../../../types/navigation";
import DashboardScreen from "../../../screens/adminScreens/Dashboard/DashboardScreen";
import EmployeesNavigator from "../../EmployeesNavigator";
import SettingsNavigator from "../../SettingsNavigator";
import RecordsNavigator from "../../RecordsNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="DailyRecords" component={RecordsNavigator} />
      <Tab.Screen name="Employees" component={EmployeesNavigator} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}