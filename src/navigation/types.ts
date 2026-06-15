export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Finance: undefined;
  Employees: undefined;
  More: undefined;
};

/**
 * Native-stack screens for the Employees tab.
 * EmployeesList is the entry point; Add/Edit screens handle CRUD.
 */
export type EmployeesStackParamList = {
  EmployeesList: undefined;
  AddEmployee: undefined;
  EditEmployee: { employeeId: string };
};

/**
 * Native-stack screens reachable from the \"More\" tab.
 * `Settings` is the entry point; `MyBusiness` mounts a full CRUD flow
 * (list → add → edit); the remaining entries stay as placeholders until
 * the respective feature lands.
 */
export type MoreStackParamList = {
  Settings: undefined;
  MyBusiness: undefined;
  AddBusiness: undefined;
  EditBusiness: { businessId: string };
  EmployeesAdmin: undefined;
  Vehicles: undefined;
  Hotels: undefined;
  AssignAssets: undefined;
};