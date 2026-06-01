export type VariantGroupKey = "base" | "price" | "capacity" | "details";

export const BASE_VARIANT_TABS: { label: string; value: VariantGroupKey }[] = [
  { label: "Základní", value: "base" },
  { label: "Cena", value: "price" },
  { label: "Kapacita", value: "capacity" },
];

export const hasDirtyFields = (dirtyFields: object) =>
  Object.keys(dirtyFields).length > 0;
