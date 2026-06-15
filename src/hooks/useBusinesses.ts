import { useCallback, useEffect, useRef, useState } from "react";

import { businessService } from "../services/businessService";
import type { BusinessRecord } from "../screens/adminScreens/MyBusiness/types";

interface UseBusinessesResult {
  data: BusinessRecord[] | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Loads the list of businesses from the persistence layer.
 *
 * Uses an incrementing request id to drop stale responses — important
 * because the list screen also reloads when the user comes back from
 * Add / Edit, and we don't want a slower in-flight refresh to overwrite
 * a newer write.
 */
export function useBusinesses(reloadKey: number = 0): UseBusinessesResult {
  const [data, setData] = useState<BusinessRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    const id = ++requestId.current;
    if (mode === "initial") setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const result = await businessService.list();
      if (id !== requestId.current) return;
      setData(result);
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : "Failed to load businesses");
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    load("initial");
  }, [load, reloadKey]);

  const refresh = useCallback(() => {
    load("refresh");
  }, [load]);

  return { data, loading, refreshing, error, refresh };
}