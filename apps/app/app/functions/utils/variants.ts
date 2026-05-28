import { Variant } from "@roo/common";

type AnyBlock = Variant["details"][number];

const COMMON_CHECKS: Array<(v: Variant) => boolean> = [
  (v) => !!v.description?.trim(),
  (v) => !!v.images.coverImage?.filename,
  (v) => (v.images.gallery?.length ?? 0) > 0,
  (v) => (v.eventTypes?.length ?? 0) > 0,
  (v) => (v.includes?.length ?? 0) > 0,
];

const VENUE_CHECKS: Array<(b: Extract<AnyBlock, { blockType: "venue" }>) => boolean> = [
  (b) => (b.includedSpaces?.length ?? 0) > 0,
  (b) => b.parking?.included != null,
  (b) => b.accommodation?.included != null,
];

const GASTRO_CHECKS: Array<(b: Extract<AnyBlock, { blockType: "gastro" }>) => boolean> = [
  (b) => (b.cuisines?.length ?? 0) > 0,
  (b) => (b.dishTypes?.length ?? 0) > 0,
  (b) => b.pricePerPerson != null,
];

const ENTERTAINMENT_CHECKS: Array<(b: Extract<AnyBlock, { blockType: "entertainment" }>) => boolean> = [
  (b) => (b.audience?.length ?? 0) > 0,
  (b) => b.performanceDuration != null,
  (b) => b.setupAndTeardown?.setupTime != null,
];

export function getVariantCompletion(variant: Variant): number {
  const block = variant.details[0];

  const commonFilled = COMMON_CHECKS.filter((check) => check(variant)).length;

  let blockFilled = 0;
  let blockTotal = 0;

  if (block?.blockType === "venue") {
    blockTotal = VENUE_CHECKS.length;
    blockFilled = VENUE_CHECKS.filter((check) =>
      check(block as Extract<AnyBlock, { blockType: "venue" }>),
    ).length;
  } else if (block?.blockType === "gastro") {
    blockTotal = GASTRO_CHECKS.length;
    blockFilled = GASTRO_CHECKS.filter((check) =>
      check(block as Extract<AnyBlock, { blockType: "gastro" }>),
    ).length;
  } else if (block?.blockType === "entertainment") {
    blockTotal = ENTERTAINMENT_CHECKS.length;
    blockFilled = ENTERTAINMENT_CHECKS.filter((check) =>
      check(block as Extract<AnyBlock, { blockType: "entertainment" }>),
    ).length;
  }

  const total = COMMON_CHECKS.length + blockTotal;
  if (total === 0) return 0;
  return Math.round(((commonFilled + blockFilled) / total) * 100);
}
