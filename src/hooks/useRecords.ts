/**
 * Hook for fetching and managing daily records (taxi and water delivery).
 * Uses the centralized mock service layer for data.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getBusinessesForRecords,
  getAllDriverRecords,
  getAllWaterDeliveryRecords,
  getDriverRecordByIdService,
  getWaterRecordByIdService,
} from '../services/recordsService';
import type { DriverRecord, Business } from '../types/taxiRecords';
import type { WaterDeliveryRecord } from '../types/waterRecords';

interface UseRecordsResult {
  businesses: Business[];
  driverRecords: DriverRecord[];
  waterRecords: WaterDeliveryRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getDriverRecordById: (id: string) => Promise<DriverRecord | undefined>;
  getWaterRecordById: (id: string) => Promise<WaterDeliveryRecord | undefined>;
}

export function useRecords(): UseRecordsResult {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [driverRecords, setDriverRecords] = useState<DriverRecord[]>([]);
  const [waterRecords, setWaterRecords] = useState<WaterDeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [businessesData, driverData, waterData] = await Promise.all([
        getBusinessesForRecords(),
        getAllDriverRecords(),
        getAllWaterDeliveryRecords(),
      ]);

      setBusinesses(businessesData);
      setDriverRecords(driverData);
      setWaterRecords(waterData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getDriverRecordById = useCallback(async (id: string) => {
    return getDriverRecordByIdService(id);
  }, []);

  const getWaterRecordById = useCallback(async (id: string) => {
    return getWaterRecordByIdService(id);
  }, []);

  return {
    businesses,
    driverRecords,
    waterRecords,
    loading,
    error,
    refresh: loadData,
    getDriverRecordById,
    getWaterRecordById,
  };
}