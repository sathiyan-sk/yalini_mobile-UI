export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Employees: undefined;
  Settings: undefined;
};

/**
 * Native-stack screens for the DailyRecords tab.
 * DailyRecordsList is the entry point; RecordDetails shows individual record.
 *  * Now supports both taxi (RecordDetails) and water (WaterRecordDetails).

 */
export type DailyRecordsStackParamList = {
  DailyRecordsList: undefined;
  RecordDetails: { recordId: string };
  WaterRecordDetails: { recordId: string };
};

/**
 * Native-stack screens for the Water Records flow.
 */
export type WaterRecordsStackParamList = {
  WaterRecordsList: undefined;
  WaterRecordDetails: { recordId: string };
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
 * Native-stack screens reachable from the Settings tab.
 * `Settings` is the entry point; `MyBusiness` mounts a full CRUD flow
 */
export type SettingsStackParamList = {
  SettingsHome: undefined;
  MyBusiness: undefined;
  AddBusiness: undefined;
  EditBusiness: { businessId: string };
  Vehicles: undefined;
  Hotels: undefined;
  AssignAssets: undefined;
  AssignAsset: { employeeId?: string; assetType?: "vehicle" | "hotel" };
};
