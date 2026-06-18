/**
 * Vehicle persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 */

import {
  getVehicles,
  createVehicle as createVehicleInStore,
  updateVehicle as updateVehicleInStore,
  deleteVehicle as deleteVehicleInStore,
  assignEmployeeToVehicle as assignInStore,
  unassignEmployeeFromVehicle as unassignInStore,
} from '../services/mockData';
import type { MockVehicle } from '../services/mockData/types';
import type { Vehicle, VehicleFormValues } from '../types/vehicle';

// Type conversion: MockVehicle is compatible with Vehicle
const toVehicleType = (mock: MockVehicle): Vehicle => mock as Vehicle;

export async function loadVehicles(): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  return vehicles.map(toVehicleType);
}

export async function saveVehicles(_vehicles: Vehicle[]): Promise<void> {
  // In mock mode, we don't need to save the entire list
  console.log('[MockService] saveVehicles called - no-op in mock mode');
}

export async function createVehicle(values: VehicleFormValues): Promise<Vehicle> {
  const created = await createVehicleInStore({
    name: values.name.trim(),
    number: values.number.trim().toUpperCase(),
    status: values.status,
    notes: values.notes?.trim() || undefined,
    assignedDriver: values.assignedDriver?.trim() || undefined,
    assignedEmployeeId: values.assignedEmployeeId || undefined,
  });
  return toVehicleType(created);
}

export async function updateVehicle(
  id: string,
  patch: VehicleFormValues
): Promise<Vehicle | null> {
  const vehicles = await getVehicles();
  const existing = vehicles.find(v => v.id === id);

  const updated = await updateVehicleInStore(id, {
    name: patch.name.trim(),
    number: patch.number.trim().toUpperCase(),
    status: patch.status,
    notes: patch.notes?.trim() || undefined,
    assignedDriver: patch.assignedDriver?.trim() || existing?.assignedDriver,
    assignedEmployeeId: patch.assignedEmployeeId || existing?.assignedEmployeeId,
  });
  return updated ? toVehicleType(updated) : null;
}

export async function deleteVehicle(id: string): Promise<void> {
  await deleteVehicleInStore(id);
}

/** Assign an employee to a vehicle */
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string,
  employeeName: string
): Promise<Vehicle | null> {
  const updated = await assignInStore(vehicleId, employeeId, employeeName);
  return updated ? toVehicleType(updated) : null;
}

/** Unassign an employee from a vehicle */
export async function unassignEmployeeFromVehicle(
  vehicleId: string
): Promise<Vehicle | null> {
  const updated = await unassignInStore(vehicleId);
  return updated ? toVehicleType(updated) : null;
}
