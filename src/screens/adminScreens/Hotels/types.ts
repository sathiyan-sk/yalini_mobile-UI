/**
 * Type contracts for the Hotels module.
 *
 * A Hotel is the persisted record managed locally (AsyncStorage). The
 * backend wiring will swap the storage layer without changing this shape.
 */

export type HotelStatusId = "active" | "inactive";

export interface Hotel {
  id: string;
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
  /** ISO-8601 date string (YYYY-MM-DD). */
  createdAt: string;
}

/** Shape used by add/edit forms (no id / createdAt on create). */
export interface HotelFormValues {
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
}

export type HotelStatusFilter = HotelStatusId | "all";
