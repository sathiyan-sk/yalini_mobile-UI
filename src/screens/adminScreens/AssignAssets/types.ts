/**
 * Type contracts for the Asset Assignment module.
 *
 * An Assignment links an Employee to either a Vehicle (taxi business)
 * or a Hotel (water delivery business).
 */

import type { BusinessTypeId } from "../MyBusiness/types";

export type AssetType = "vehicle" | "hotel";

export interface Assignment {
  id: string;
  employeeId: string;
  employeeName: string;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  /** ISO-8601 date string (YYYY-MM-DD). */
  assignedAt: string;
}

export interface AssignmentFormValues {
  employeeId: string;
  assetId: string;
  assetType: AssetType;
}

export type BusinessTypeFilter = BusinessTypeId | "all";
