/**
 * Employee persistence service — Mock Service Layer implementation.
 *
 * This service now uses the central mock data store instead of AsyncStorage.
 * To wire a real backend, replace the mock store calls with API calls.
 */

import {
  getEmployees,
  getBusinessById,
  createEmployee as createEmployeeInStore,
  updateEmployee as updateEmployeeInStore,
  deleteEmployee as deleteEmployeeInStore,
} from '../services/mockData';
import type { MockEmployee } from '../services/mockData/types';
import type {
  Employee,
  EmployeeFormValues,
} from '../screens/adminScreens/Employees/types';

// Type conversion: MockEmployee is compatible with Employee
const toEmployeeType = (mock: MockEmployee): Employee => mock as Employee;

export async function loadEmployees(): Promise<Employee[]> {
  const employees = await getEmployees();
  return employees.map(toEmployeeType);
}

export async function saveEmployees(_employees: Employee[]): Promise<void> {
  // In mock mode, we don't need to save the entire list
  console.log('[MockService] saveEmployees called - no-op in mock mode');
}

export async function createEmployee(values: EmployeeFormValues): Promise<Employee> {
  // Get business details
  const business = await getBusinessById(values.businessId);

  const created = await createEmployeeInStore({
    fullName: values.fullName.trim(),
    mobile: values.mobile.replace(/\D/g, ''),
    businessId: values.businessId,
    businessName: business?.name ?? 'Unknown Business',
    businessType: business?.type ?? 'taxi',
    pin: values.pin,
    status: values.status,
  });
  return toEmployeeType(created);
}

export async function updateEmployee(
  id: string,
  values: EmployeeFormValues
): Promise<Employee | null> {
  // Get business details
  const business = await getBusinessById(values.businessId);
  const employees = await getEmployees();
  const existing = employees.find(e => e.id === id);

  const updated = await updateEmployeeInStore(id, {
    fullName: values.fullName.trim(),
    mobile: values.mobile.replace(/\D/g, ''),
    businessId: values.businessId,
    businessName: business?.name ?? existing?.businessName ?? 'Unknown Business',
    businessType: business?.type ?? existing?.businessType ?? 'taxi',
    pin: values.pin || existing?.pin || '0000',
    status: values.status,
  });
  return updated ? toEmployeeType(updated) : null;
}

export async function deleteEmployee(id: string): Promise<void> {
  await deleteEmployeeInStore(id);
}
