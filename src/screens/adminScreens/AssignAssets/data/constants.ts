/**
 * Constants for the Asset Assignment module.
 */

import type { Ionicons } from "@expo/vector-icons";
import type { ToneKey } from "../../../../theme";
import type { AssetType } from "../types";

/** Deep navy used by the form-screen sticky headers (Add / Edit). Matches design ref. */
export const FORM_HEADER_BG = "#0F1F4D";

/** AsyncStorage key for the persisted assignments list (versioned for safe migrations). */
export const ASSIGNMENT_STORAGE_KEY = "@yalini/assignments/v1";

export interface AssetTypeOption {
  id: AssetType;
  label: string;
  description: string;
  tone: ToneKey;
  iconName: keyof typeof Ionicons.glyphMap;
  businessType: "taxi" | "water_delivery";
}

export const ASSET_TYPE_OPTIONS: AssetTypeOption[] = [
  {
    id: "vehicle",
    label: "Vehicle",
    description: "Assign vehicles to taxi business employees",
    tone: "purple",
    iconName: "car-sport",
    businessType: "taxi",
  },
  {
    id: "hotel",
    label: "Hotel",
    description: "Assign hotels to water delivery employees",
    tone: "blue",
    iconName: "bed",
    businessType: "water_delivery",
  },
];

export const ASSET_TYPE_MAP: Record<AssetType, AssetTypeOption> =
  ASSET_TYPE_OPTIONS.reduce(
    (acc, option) => {
      acc[option.id] = option;
      return acc;
    },
    {} as Record<AssetType, AssetTypeOption>,
  );
