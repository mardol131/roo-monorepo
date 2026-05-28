import { Space } from "@roo/common";

const COMPLETION_CHECKS: Array<(space: Space) => boolean> = [
  (s) => !!s.description?.trim(),
  (s) => s.capacity != null,
  (s) => s.area != null,
  (s) => (s.images?.length ?? 0) > 0,
];

export function getSpaceCompletion(space: Space): number {
  const filled = COMPLETION_CHECKS.filter((check) => check(space)).length;
  return Math.round((filled / COMPLETION_CHECKS.length) * 100);
}
