/**
 * Module-scoped store for the persisted hotels list.
 *
 * - Single in-memory cache + listener fan-out so all screens that mount
 *   `useHotels` see the same snapshot and re-render on every mutation
 *   (e.g. Add -> back -> List should reflect the new row instantly).
 * - Asynchronously hydrated from the local storage service on first read.
 */
import { useCallback, useEffect, useState } from "react";

import {
  createHotel,
  deleteHotel,
  loadHotels,
  updateHotel,
} from "../services/hotelService";
import type { Hotel, HotelFormValues } from "../../screens/Hotels/types";

type Listener = (snapshot: Hotel[]) => void;

let cache: Hotel[] | null = null;
let hydrating: Promise<Hotel[]> | null = null;
const listeners = new Set<Listener>();

function notify(snapshot: Hotel[]) {
  cache = snapshot;
  listeners.forEach((l) => l(snapshot));
}

async function hydrate(): Promise<Hotel[]> {
  if (cache) return cache;
  if (hydrating) return hydrating;
  hydrating = loadHotels().then((list) => {
    cache = list;
    hydrating = null;
    listeners.forEach((l) => l(list));
    return list;
  });
  return hydrating;
}

interface UseHotelsResult {
  hotels: Hotel[];
  loading: boolean;
  addHotel: (values: HotelFormValues) => Promise<Hotel>;
  editHotel: (id: string, values: HotelFormValues) => Promise<Hotel | null>;
  removeHotel: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useHotels(): UseHotelsResult {
  const [hotels, setHotels] = useState<Hotel[]>(() => cache ?? []);
  const [loading, setLoading] = useState<boolean>(() => cache === null);

  useEffect(() => {
    let mounted = true;
    const listener: Listener = (snapshot) => {
      if (mounted) setHotels(snapshot);
    };
    listeners.add(listener);

    hydrate()
      .then((snapshot) => {
        if (!mounted) return;
        setHotels(snapshot);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  const addHotel = useCallback(async (values: HotelFormValues) => {
    const created = await createHotel(values);
    const current = cache ?? (await loadHotels());
    notify([created, ...current.filter((h) => h.id !== created.id)]);
    return created;
  }, []);

  const editHotel = useCallback(
    async (id: string, values: HotelFormValues) => {
      const updated = await updateHotel(id, values);
      if (!updated) return null;
      const current = cache ?? (await loadHotels());
      notify(current.map((h) => (h.id === id ? updated : h)));
      return updated;
    },
    []
  );

  const removeHotel = useCallback(async (id: string) => {
    await deleteHotel(id);
    const current = cache ?? (await loadHotels());
    notify(current.filter((h) => h.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    cache = null;
    const fresh = await loadHotels();
    notify(fresh);
  }, []);

  return { hotels, loading, addHotel, editHotel, removeHotel, refresh };
}
