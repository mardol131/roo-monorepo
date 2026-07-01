"use client";

import Text from "@/app/components/ui/atoms/text";
import SelectableOptionCard from "@/app/components/ui/molecules/selectable-option-card";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { useOrderStore } from "@/app/store/order-store";
import type { Space } from "@roo/common";
import { CornerDownRight, ImageOff } from "lucide-react";
import Image from "next/image";

type PricingUnit = "per_day" | "per_person" | "per_hour" | "lump_sum";

const PRICING_UNIT_LABELS: Record<PricingUnit, string> = {
  per_day: "/ den",
  per_person: "/ os.",
  per_hour: "/ hod.",
  lump_sum: "/ událost",
};

const TYPE_LABEL: Record<Space["type"], string> = {
  area: "Areál",
  building: "Budova",
  room: "Místnost",
};

function getParentId(space: Space): string | null {
  if (!space.parent) return null;
  return typeof space.parent === "string" ? space.parent : space.parent.id;
}

// All descendants at any depth (children, grandchildren, ...), not just direct children.
function getDescendantIds(spaceId: string, allSpaces: Space[]): string[] {
  const directChildren = allSpaces.filter((s) => getParentId(s) === spaceId);
  return directChildren.flatMap((child) => [
    child.id,
    ...getDescendantIds(child.id, allSpaces),
  ]);
}

// Walks the full ancestor chain (not just the direct parent).
function hasSelectedAncestor(
  space: Space,
  allSpaces: Space[],
  selectedIds: Set<string>,
): boolean {
  let parentId = getParentId(space);
  while (parentId) {
    if (selectedIds.has(parentId)) return true;
    const parent = allSpaces.find((s) => s.id === parentId);
    parentId = parent ? getParentId(parent) : null;
  }
  return false;
}

function SpaceThumbnail({ space }: { space: Space }) {
  const filename = space.images.coverImage.filename;

  if (!filename) {
    return (
      <div className="w-14 h-14 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
        <ImageOff className="w-5 h-5 text-zinc-300" />
      </div>
    );
  }

  return (
    <Image
      width={112}
      height={112}
      src={generateMediaUrl(filename)}
      alt={space.images.coverImage.alt ?? space.name}
      className="w-14 h-14 rounded-lg object-cover shrink-0"
    />
  );
}

function SpaceTreeNode({
  space,
  allSpaces,
  depth,
}: {
  space: Space;
  allSpaces: Space[];
  depth: number;
}) {
  const { selectedSpaces, toggleSpace } = useOrderStore();
  const selectedIds = new Set(selectedSpaces.map((s) => s.spaceId));
  const isSelected = selectedIds.has(space.id);
  const isIncluded = hasSelectedAncestor(space, allSpaces, selectedIds);
  const children = allSpaces.filter((s) => getParentId(s) === space.id);

  function handleToggle() {
    toggleSpace(
      {
        spaceId: space.id,
        name: space.name,
        price: space.price.base,
        pricingUnit: space.price.pricingUnit,
      },
      getDescendantIds(space.id, allSpaces),
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {depth > 0 && (
          <CornerDownRight className="w-4 h-4 text-zinc-300 shrink-0" />
        )}
        <div className="flex-1">
          <SelectableOptionCard
            isActive={isSelected}
            disabled={isIncluded}
            onClick={handleToggle}
            price={
              isIncluded ? (
                <div className="flex items-center gap-1.5 bg-success-surface rounded-full px-3 py-1">
                  <span className="text-xs text-success font-medium">
                    Zahrnuto
                  </span>
                </div>
              ) : (
                <Text variant="caption" color="secondary">
                  {space.price.base.toLocaleString("cs-CZ")} Kč{" "}
                  {PRICING_UNIT_LABELS[space.price.pricingUnit]}
                </Text>
              )
            }
          >
            <SpaceThumbnail space={space} />
            <div>
              <Text variant="label-lg" color="textDark">
                {space.name}
                <span className="ml-1.5 text-xs text-zinc-400 font-normal">
                  {TYPE_LABEL[space.type]}
                </span>
              </Text>
              {space.capacity && (
                <Text variant="caption" color="secondary">
                  Kapacita: {space.capacity} osob
                </Text>
              )}
            </div>
          </SelectableOptionCard>
        </div>
      </div>

      {children.length > 0 && (
        <div className="ml-8 flex flex-col gap-2 mt-2">
          {children.map((child) => (
            <SpaceTreeNode
              key={child.id}
              space={child}
              allSpaces={allSpaces}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SpaceTreeList({ spaces }: { spaces: Space[] }) {
  const roots = spaces.filter((s) => !getParentId(s));

  return (
    <div className="flex flex-col gap-2">
      {roots.map((root) => (
        <SpaceTreeNode
          key={root.id}
          space={root}
          allSpaces={spaces}
          depth={0}
        />
      ))}
    </div>
  );
}
