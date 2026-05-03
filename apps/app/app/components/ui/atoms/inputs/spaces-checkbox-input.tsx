"use client";

import { Space } from "@roo/common";
import { CornerDownRight } from "lucide-react";
import InputLabel from "../input-label";
import Checkbox from "./checkbox";

type Item = { id: string; name: string };

type Props = {
  label?: string;
  spaces: Space[];
  value: Item[];
  onChange: (value: Item[]) => void;
  checkColor?: string;
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

function SpaceNode({
  space,
  allSpaces,
  value,
  onToggle,
  depth,
  checkColor,
}: {
  space: Space;
  allSpaces: Space[];
  value: Item[];
  onToggle: (space: Space) => void;
  depth: number;
  checkColor?: string;
}) {
  const children = allSpaces.filter((s) => getParentId(s) === space.id);
  const isChecked = value.some((v) => v.id === space.id);

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {depth > 0 && (
          <CornerDownRight className="w-4 h-4 text-zinc-300 shrink-0" />
        )}
        <Checkbox
          checked={isChecked}
          onChange={() => onToggle(space)}
          label={
            <span>
              {space.name}
              <span className="ml-1.5 text-xs text-zinc-400">
                {TYPE_LABEL[space.type]}
              </span>
            </span>
          }
          checkColor={checkColor}
        />
      </div>
      {children.length > 0 && (
        <div className="ml-6 mt-1 flex flex-col gap-1">
          {children.map((child) => (
            <SpaceNode
              key={child.id}
              space={child}
              allSpaces={allSpaces}
              value={value}
              onToggle={onToggle}
              depth={depth + 1}
              checkColor={checkColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SpacesCheckboxInput({
  label,
  spaces,
  value,
  onChange,
  checkColor,
}: Props) {
  const roots = spaces.filter((s) => !getParentId(s));

  function toggle(space: Space) {
    const isSelected = value.some((v) => v.id === space.id);
    onChange(
      isSelected
        ? value.filter((v) => v.id !== space.id)
        : [...value, { id: space.id, name: space.name }],
    );
  }

  if (!spaces.length) {
    return (
      <div className="flex flex-col gap-2">
        {label && <InputLabel label={label} />}
        <p className="text-sm text-zinc-400">
          Žádné prostory zatím neexistují. Nejdříve je přidejte ve správě
          prostorů.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <InputLabel label={label} />}
      <div className="flex flex-col gap-5">
        {roots.map((root) => (
          <SpaceNode
            key={root.id}
            space={root}
            allSpaces={spaces}
            value={value}
            onToggle={toggle}
            depth={0}
            checkColor={checkColor}
          />
        ))}
      </div>
    </div>
  );
}
