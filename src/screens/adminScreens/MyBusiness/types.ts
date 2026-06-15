import type { Ionicons } from "@expo/vector-icons";

/**
 * Catalogue of business categories the admin can pick from.
 *
 * Locked to two types per product spec: a ride-hailing business
 * (\"Taxi\") and a mineral-water delivery business (\"Water\"). Adding new
 * entries means appending to BUSINESS_TYPES in data/businessTypes.ts —
 * the rest of the UI is data-driven from that list.
 */
export type BusinessTypeId = "taxi" | "water";

export interface BusinessTypeDefinition {
  id: BusinessTypeId;
  /** Display label on selector chips / list cards (e.g. "Taxi"). */
  label: string;
  /** Sentence-cased asset noun used inside copy ("vehicles", "water cans"). */
  assetNoun: string;
  /** Ionicons glyph rendered inside the tinted tile. */
  icon: keyof typeof Ionicons.glyphMap;
  /** Background tint applied to the icon tile. */
  iconBg: string;
  /** Foreground colour applied to the glyph and the matching tag pill. */
  iconColor: string;
  /** Tag pill background used in the list view. */
  tagBg: string;
}

/** How vehicles / hotels are allocated to employees for a given business. */
export type BusinessMode = "auto" | "manual";

export interface BusinessRecord {
  id: string;
  name: string;
  type: BusinessTypeId;
  mode: BusinessMode;
  description: string;
  active: boolean;
  /** ISO timestamp — used to sort the list, newest first. */
  createdAt: string;
  updatedAt: string;
}

/** Payload sent to `businessService.create`. */
export type CreateBusinessInput = Pick<
  BusinessRecord,
  "name" | "type" | "mode" | "description"
>;

/** Payload sent to `businessService.update`. */
export type UpdateBusinessInput = Partial<
  Pick<BusinessRecord, "name" | "mode" | "description" | "active">
>;