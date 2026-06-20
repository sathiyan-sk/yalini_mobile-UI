/**
 * Type definitions for Driver module
 */

export type SessionStatus = "OPEN" | "SUBMITTED";

export type PaymentMode = "cash" | "online";

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
  businessType: "taxi";
  role: "Driver";
}

export interface TripSummary {
  id: string;
  destination: string;
  income: number;
  expense: number;
  time: string;
}

export interface TodayOverview {
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface RecentActivity {
  id: string;
  type: "trip" | "expense";
  description: string;
  amount: number;
  time: string;
}

export interface DriverHomeData {
  driver: DriverInfo;
  assignment: DriverAssignment | null;
  sessionStatus: SessionStatus;
  sessionDate: string;
  sessionStartTime: string;
  todayOverview: TodayOverview;
  recentActivity: RecentActivity[];
  notificationCount: number;
}
/**
 * Trip Form Data - Used for Add Trip screen
 */
export interface TripFormData {
  from: string;
  to: string;
  amount: string;
  paymentMode: PaymentMode;
}

/**
 * Trip - Complete trip data structure
 */
export interface Trip {
  id: string;
  from: string;
  to: string;
  amount: number;
  paymentMode: PaymentMode;
  driverId: string;
  vehicleId: string;
  sessionId: string;
  createdAt: string;
  status: "completed" | "cancelled";
}