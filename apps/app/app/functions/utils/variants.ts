import {
  CompletionField,
  CompletionFullResult,
} from "@/app/[locale]/(user)/components/completion-widget";
import { Variant } from "@roo/common";

type CheckEntry = {
  check: (v: Variant) => boolean;
  label: string;
};

const CHECKS: CheckEntry[] = [
  { check: (v) => !!v.description?.trim(), label: "Popis varianty" },
  { check: (v) => !!v.images.coverImage?.filename, label: "Titulní foto" },
  { check: (v) => (v.images.gallery?.length ?? 0) > 0, label: "Galerie fotek" },
  {
    check: (v) => (v.includes?.length ?? 0) > 0,
    label: "Co varianta obsahuje",
  },
];

/**
 * Kapacita varianty je orientační doporučení, ne tvrdý limit — formátuje se
 * proto jako "Doporučeno pro …". Vrací null, když není vyplněná.
 */
export function formatVariantCapacity(
  capacity: Variant["capacity"],
): string | null {
  const { min, max } = capacity;
  if (min && max) return `Doporučeno pro ${min}–${max} osob`;
  if (max) return `Doporučeno pro až ${max} osob`;
  if (min) return `Doporučeno pro ${min}+ osob`;
  return null;
}

export function getVariantCompletion(variant: Variant): number {
  const filled = CHECKS.filter(({ check }) => check(variant)).length;
  return Math.round((filled / CHECKS.length) * 100);
}

export function getFullVariantCompletion(
  variant: Variant,
): CompletionFullResult {
  const fieldsToComplete: CompletionField[] = [];
  for (const { check, label } of CHECKS) {
    if (!check(variant)) fieldsToComplete.push({ label });
  }
  const filled = CHECKS.length - fieldsToComplete.length;
  return {
    percentage: Math.round((filled / CHECKS.length) * 100),
    fieldsToComplete,
  };
}
