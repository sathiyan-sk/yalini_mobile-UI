/**
 * Type contracts for the Driver StartDay module.
 */

export interface DriverAssignment {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  isAssigned: boolean;
}

export interface DriverInfo {
  id: string;
  name: string;
  businessName: string;
  businessType: 'taxi';
  role: 'Driver';
}

export interface StartDayData {
  driver: DriverInfo;
  assignment: DriverAssignment | null;
}
