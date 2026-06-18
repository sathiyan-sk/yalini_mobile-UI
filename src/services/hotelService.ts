/**
 * Hotel persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 */

import {
  getHotels,
  createHotel as createHotelInStore,
  updateHotel as updateHotelInStore,
  deleteHotel as deleteHotelInStore,
  assignEmployeeToHotel as assignInStore,
  unassignEmployeeFromHotel as unassignInStore,
} from '../services/mockData';
import type { MockHotel } from '../services/mockData/types';
import type { Hotel, HotelFormValues } from '../screens/adminScreens/Hotels/types';

// Type conversion: MockHotel is compatible with Hotel
const toHotelType = (mock: MockHotel): Hotel => mock as Hotel;

export async function loadHotels(): Promise<Hotel[]> {
  const hotels = await getHotels();
  return hotels.map(toHotelType);
}

export async function saveHotels(_hotels: Hotel[]): Promise<void> {
  // In mock mode, we don't need to save the entire list
  console.log('[MockService] saveHotels called - no-op in mock mode');
}

export async function createHotel(values: HotelFormValues): Promise<Hotel> {
  const created = await createHotelInStore({
    name: values.name.trim(),
    ratePerCan: values.ratePerCan,
    status: values.status,
    location: values.location?.trim() || undefined,
    assignedEmployeeId: values.assignedEmployeeId || undefined,
    assignedEmployeeName: values.assignedEmployeeName || undefined,
  });
  return toHotelType(created);
}

export async function updateHotel(
  id: string,
  patch: HotelFormValues
): Promise<Hotel | null> {
  const hotels = await getHotels();
  const existing = hotels.find(h => h.id === id);

  const updated = await updateHotelInStore(id, {
    name: patch.name.trim(),
    ratePerCan: patch.ratePerCan,
    status: patch.status,
    location: patch.location?.trim() || existing?.location,
    assignedEmployeeId: patch.assignedEmployeeId ?? existing?.assignedEmployeeId,
    assignedEmployeeName: patch.assignedEmployeeName ?? existing?.assignedEmployeeName,
  });
  return updated ? toHotelType(updated) : null;
}

export async function deleteHotel(id: string): Promise<void> {
  await deleteHotelInStore(id);
}

/** Assign an employee to a hotel */
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string,
  employeeName: string
): Promise<Hotel | null> {
  const updated = await assignInStore(hotelId, employeeId, employeeName);
  return updated ? toHotelType(updated) : null;
}

/** Unassign an employee from a hotel */
export async function unassignEmployeeFromHotel(
  hotelId: string
): Promise<Hotel | null> {
  const updated = await unassignInStore(hotelId);
  return updated ? toHotelType(updated) : null;
}
