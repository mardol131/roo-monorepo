export const FIXED_SECTION_KEYS = [
  "description",
  "location",
  "basics",
  "detail",
  "employees",
  "references",
  "faq",
  "company",
] as const;

export type FixedSectionKey = (typeof FIXED_SECTION_KEYS)[number];

export const DEFAULT_SECTION_ORDER: FixedSectionKey[] = [
  "description",
  "location",
  "basics",
  "detail",
  "employees",
  "references",
  "faq",
  "company",
];
