import {
  CompletionField,
  CompletionFullResult,
} from "@/app/[locale]/(user)/components/completion-widget";
import { Variant } from "@roo/common";

type AnyBlock = Variant["details"][number];

type CheckEntry<T> = {
  check: (v: T) => boolean;
  label: string;
};

const COMMON_CHECKS: CheckEntry<Variant>[] = [
  { check: (v) => !!v.description?.trim(), label: "Popis varianty" },
  { check: (v) => !!v.images.coverImage?.filename, label: "Titulní foto" },
  { check: (v) => (v.images.gallery?.length ?? 0) > 0, label: "Galerie fotek" },
  {
    check: (v) => (v.includes?.length ?? 0) > 0,
    label: "Co varianta obsahuje",
  },
];

const VENUE_CHECKS: CheckEntry<Extract<AnyBlock, { blockType: "venue" }>>[] = [
  {
    check: (b) => (b.includedSpaces?.length ?? 0) > 0,
    label: "Zahrnuté prostory",
  },
];

const GASTRO_CHECKS: CheckEntry<Extract<AnyBlock, { blockType: "gastro" }>>[] =
  [
    {
      check: (b) => b.minimumOrderAmount != null,
      label: "Minimální výše objednávky",
    },
  ];

const ENTERTAINMENT_CHECKS: CheckEntry<
  Extract<AnyBlock, { blockType: "entertainment" }>
>[] = [
  { check: (b) => (b.audience?.length ?? 0) > 0, label: "Cílové publikum" },
  {
    check: (b) =>
      !b.performance?.entertainmentIsPerformance ||
      b.performance?.numberOfSets != null,
    label: "Počet setů",
  },
];

export function getVariantCompletion(variant: Variant): number {
  const block = variant.details[0];

  const commonFilled = COMMON_CHECKS.filter(({ check }) =>
    check(variant),
  ).length;

  let blockFilled = 0;
  let blockTotal = 0;

  if (block?.blockType === "venue") {
    blockTotal = VENUE_CHECKS.length;
    blockFilled = VENUE_CHECKS.filter(({ check }) =>
      check(block as Extract<AnyBlock, { blockType: "venue" }>),
    ).length;
  } else if (block?.blockType === "gastro") {
    blockTotal = GASTRO_CHECKS.length;
    blockFilled = GASTRO_CHECKS.filter(({ check }) =>
      check(block as Extract<AnyBlock, { blockType: "gastro" }>),
    ).length;
  } else if (block?.blockType === "entertainment") {
    blockTotal = ENTERTAINMENT_CHECKS.length;
    blockFilled = ENTERTAINMENT_CHECKS.filter(({ check }) =>
      check(block as Extract<AnyBlock, { blockType: "entertainment" }>),
    ).length;
  }

  const total = COMMON_CHECKS.length + blockTotal;
  if (total === 0) return 0;
  return Math.round(((commonFilled + blockFilled) / total) * 100);
}

export function getFullVariantCompletion(
  variant: Variant,
): CompletionFullResult {
  const block = variant.details[0];
  const fieldsToComplete: CompletionField[] = [];

  for (const { check, label } of COMMON_CHECKS) {
    if (!check(variant)) fieldsToComplete.push({ label });
  }

  if (block?.blockType === "venue") {
    for (const { check, label } of VENUE_CHECKS) {
      if (!check(block as Extract<AnyBlock, { blockType: "venue" }>))
        fieldsToComplete.push({ label });
    }
  } else if (block?.blockType === "gastro") {
    for (const { check, label } of GASTRO_CHECKS) {
      if (!check(block as Extract<AnyBlock, { blockType: "gastro" }>))
        fieldsToComplete.push({ label });
    }
  } else if (block?.blockType === "entertainment") {
    for (const { check, label } of ENTERTAINMENT_CHECKS) {
      if (!check(block as Extract<AnyBlock, { blockType: "entertainment" }>))
        fieldsToComplete.push({ label });
    }
  }

  const totalChecks =
    COMMON_CHECKS.length +
    (block?.blockType === "venue"
      ? VENUE_CHECKS.length
      : block?.blockType === "gastro"
        ? GASTRO_CHECKS.length
        : block?.blockType === "entertainment"
          ? ENTERTAINMENT_CHECKS.length
          : 0);

  const filled = totalChecks - fieldsToComplete.length;
  const percentage =
    totalChecks === 0 ? 0 : Math.round((filled / totalChecks) * 100);

  return { percentage, fieldsToComplete };
}
