export type PricingUnits = "per_day" | "per_person" | "per_hour" | "lump_sum";

export const PRICING_UNITS_ARRAY: PricingUnits[] = [
  "per_day",
  "per_person",
  "per_hour",
  "lump_sum",
];

export function getPricingUnits(units: PricingUnits[]): PricingUnits[] {
  return units.filter((unit) => PRICING_UNITS_ARRAY.includes(unit));
}

export type TravelFeeType = "one_way" | "round_trip";

export const TRAVEL_FEE_TYPE_ARRAY: TravelFeeType[] = ["one_way", "round_trip"];
