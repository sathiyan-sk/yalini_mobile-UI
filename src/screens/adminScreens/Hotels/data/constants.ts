/**
 * Hotel module constants and configuration.
 */

export const HOTEL_STORAGE_KEY = "@yalini_hotels_v1";

/** Status options for the filter sheet. */
export const HOTEL_STATUS_OPTIONS: Array<{
  id: "all" | "active" | "inactive";
  label: string;
}> = [
  { id: "all", label: "All Status" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];
