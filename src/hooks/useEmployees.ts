/**
 * Module-scoped store for the persisted employees list.
 *
 * - Single in-memory cache + listener fan-out so all screens that mount
 *   `useEmployees` see the same snapshot and re-render on every mutation.
 * - Asynchronously hydrated from the local storage service on first read.
 */
import { useCallback, useEffect, useState } from "react";

import {
  createEmployee,
  deleteEmployee,
  loadEmployees,
  updateEmployee,
} from "../services/employeeService";
import type {
  Employee,
  EmployeeFormValues,
} from "../screens/adminScreens/Employees/types";

type Listener = (snapshot: Employee[]) => void;

let cache: Employee[] | null = null;
let hydrating: Promise<Employee[]> | null = null;
const listeners = new Set<Listener>();

function notify(snapshot: Employee[]) {
  cache = snapshot;
  listeners.forEach((l) => l(snapshot));
}

async function hydrate(): Promise<Employee[]> {
  if (cache) return cache;
  if (hydrating) return hydrating;
  hydrating = loadEmployees().then((list) => {
    cache = list;
    hydrating = null;
    listeners.forEach((l) => l(list));
    return list;
  });
  return hydrating;
}

interface UseEmployeesResult {
  employees: Employee[];
  loading: boolean;
  addEmployee: (values: EmployeeFormValues) => Promise<Employee>;
  editEmployee: (
    id: string,
    values: EmployeeFormValues,
  ) => Promise<Employee | null>;
  removeEmployee: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>(() => cache ?? []);
  const [loading, setLoading] = useState<boolean>(() => cache === null);

  useEffect(() => {
    let mounted = true;
    const listener: Listener = (snapshot) => {
      if (mounted) setEmployees(snapshot);
    };
    listeners.add(listener);

    hydrate()
      .then((snapshot) => {
        if (!mounted) return;
        setEmployees(snapshot);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  const addEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      const created = await createEmployee(values);
      const current = cache ?? (await loadEmployees());
      notify([created, ...current.filter((e) => e.id !== created.id)]);
      return created;
    },
    [],
  );

  const editEmployee = useCallback(
    async (id: string, values: EmployeeFormValues) => {
      const updated = await updateEmployee(id, values);
      if (!updated) return null;
      const current = cache ?? (await loadEmployees());
      notify(current.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    [],
  );

  const removeEmployee = useCallback(async (id: string) => {
    await deleteEmployee(id);
    const current = cache ?? (await loadEmployees());
    notify(current.filter((e) => e.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    cache = null;
    const fresh = await loadEmployees();
    notify(fresh);
  }, []);

  return { employees, loading, addEmployee, editEmployee, removeEmployee, refresh };
}
