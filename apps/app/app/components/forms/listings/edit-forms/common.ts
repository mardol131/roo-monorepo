export type GroupKey =
  | "base"
  | "price"
  | "locality"
  | "recommended"
  | "priceable"
  | "supplementary";

export function useListingEditFormsCommons() {
  const GROUP_TABS: { label: string; value: GroupKey }[] = [
    { label: "Základní", value: "base" },
    { label: "Cena", value: "price" },
    { label: "Lokalita", value: "locality" },
    { label: "Doporučené", value: "recommended" },
    { label: "Ocenitelné", value: "priceable" },
    { label: "Doplňkové", value: "supplementary" },
  ];

  return { GROUP_TABS };
}

export const hasDirtyFields = (dirtyFields: object) =>
  Object.keys(dirtyFields).length > 0;
