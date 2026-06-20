/**
 * Mock data for Driver StartDay screen.
 * This demonstrates both assigned and unassigned scenarios.
 */

import type { StartDayData } from '../types';

// Mock data for a driver with an assigned vehicle
export const DRIVER_WITH_VEHICLE: StartDayData = {
  driver: {
    id: 'emp_seed_ramesh',
    name: 'Ramesh Kumar',
    businessName: 'City Taxi Service',
    businessType: 'taxi',
    role: 'Driver',
  },
  assignment: {
    vehicleId: 'veh_seed_swift_dzire',
    vehicleName: 'Vehicle 1',
    vehicleNumber: 'TN 01 AB 1234',
    isAssigned: true,
  },
};

// Mock data for a driver without an assigned vehicle
export const DRIVER_WITHOUT_VEHICLE: StartDayData = {
  driver: {
    id: 'emp_seed_ramesh',
    name: 'Ramesh Kumar',
    businessName: 'City Taxi Service',
    businessType: 'taxi',
    role: 'Driver',
  },
  assignment: null,
};

// Default mock data (with vehicle assigned)
export const DEFAULT_DRIVER_DATA = DRIVER_WITH_VEHICLE;
