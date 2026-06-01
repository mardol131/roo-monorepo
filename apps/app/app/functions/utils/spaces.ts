import { CompletionFullResult } from "@/app/[locale]/(user)/components/completion-widget";
import { Space } from "@roo/common";

type CheckEntry = {
  check: (s: Space) => boolean;
  label: string;
};

const COMPLETION_CHECKS: CheckEntry[] = [
  { check: (s) => !!s.description?.trim(), label: "Popis prostoru" },
  { check: (s) => s.capacity != null, label: "Kapacita osob" },
  { check: (s) => s.area != null, label: "Plocha (m²)" },
  { check: (s) => (s.images?.length ?? 0) > 0, label: "Fotografie" },
  {
    check: (s) => s.price?.base != null && s.price?.pricingUnit != null,
    label: "Cena a jednotka",
  },
];

export function getSpaceCompletion(space: Space): number {
  const filled = COMPLETION_CHECKS.filter(({ check }) => check(space)).length;
  return Math.round((filled / COMPLETION_CHECKS.length) * 100);
}

export function getFullSpaceCompletion(space: Space): CompletionFullResult {
  const fieldsToComplete = COMPLETION_CHECKS.filter(
    ({ check }) => !check(space),
  ).map(({ label }) => ({ label }));

  const filled = COMPLETION_CHECKS.length - fieldsToComplete.length;
  const percentage = Math.round((filled / COMPLETION_CHECKS.length) * 100);

  return { percentage, fieldsToComplete };
}
