export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Finance: undefined;
  Employees: undefined;
  More: undefined;
};

/**
 * Native-stack screens reachable from the \"More\" tab.
 *
 * `Settings` is the entry point. The Business feature lives under three
 * dedicated screens:
 *  - `MyBusiness`  — listing of every configured business
 *  - `AddBusiness` — create flow
 *  - `EditBusiness` — update flow, scoped to a single business by id
 *
 * The remaining destinations stay as placeholders until those features land.
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
