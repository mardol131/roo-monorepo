"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, Layers, Lock, Trash2 } from "lucide-react";
import { useRef } from "react";
import Text from "../text";
import { FIXED_SECTION_KEYS, FixedSectionKey } from "@roo/common";

export type SectionOrderItem =
  | { type: "fixed"; key: FixedSectionKey; label: string }
  | { type: "custom"; id: string; label: string };

const fixedSectionLabels: Record<FixedSectionKey, string> = {
  description: "O tomto inzerátu",
  location: "Lokalita",
  basics: "Základní informace",
  detail: "Detailní informace",
  employees: "Náš tým",
  references: "Reference",
  faq: "Časté otázky",
  company: "O firmě",
};

interface SortableItemProps {
  item: SectionOrderItem;
  index: number;
  onRemove?: () => void;
}

function SortableItem({ item, index, onRemove }: SortableItemProps) {
  const { ref, isDragging, handleRef } = useSortable({
    id: item.type === "fixed" ? item.key : item.id,
    index,
  });

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 px-4 py-3 bg-white border rounded-lg transition-shadow ${
        isDragging ? "opacity-50 shadow-lg z-10" : "border-zinc-200"
      }`}
    >
      <button
        ref={handleRef}
        type="button"
        className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 shrink-0"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        {item.type === "fixed" ? (
          <Lock size={14} className="text-zinc-300 shrink-0" />
        ) : (
          <Layers size={14} className="text-primary shrink-0" />
        )}
        <Text variant="label-lg" color="textDark">
          {item.label}
        </Text>
      </div>

      {item.type === "custom" && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-300 hover:text-danger transition-colors shrink-0"
        >
          <Trash2 size={16} />
        </button>
      )}
      {item.type === "fixed" && (
        <Text
          as="span"
          variant="caption"
          color="textLight"
          className="shrink-0"
        >
          pevná
        </Text>
      )}
    </div>
  );
}

interface SectionOrderInputProps {
  value: SectionOrderItem[];
  onChange: (items: SectionOrderItem[]) => void;
}

type DragEvent = {
  operation: {
    source: { id: string | number } | null;
    target: { id: string | number } | null;
  };
  canceled?: boolean;
};

export default function SectionOrderInput({
  value,
  onChange,
}: SectionOrderInputProps) {
  const getItemId = (item: SectionOrderItem) =>
    item.type === "fixed" ? item.key : item.id;

  // OptimisticSortingPlugin moves the dragged item visually to the target position,
  // so at onDragEnd the collision is source vs itself. We track the last valid
  // source→target pair in onDragOver (before optimistic reordering takes effect).
  const pendingSwap = useRef<{ sourceId: string; targetId: string } | null>(null);

  const handleDragOver = (event: DragEvent) => {
    const { source, target } = event.operation;
    if (!source || !target) return;
    const sourceId = String(source.id);
    const targetId = String(target.id);
    if (sourceId === targetId) return;
    pendingSwap.current = { sourceId, targetId };
  };

  const handleDragEnd = (event: DragEvent) => {
    const swap = pendingSwap.current;
    pendingSwap.current = null;

    if (event.canceled || !swap) return;

    const sourceIndex = value.findIndex((item) => getItemId(item) === swap.sourceId);
    const targetIndex = value.findIndex((item) => getItemId(item) === swap.targetId);

    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex)
      return;

    const next = [...value];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  const handleRemoveCustom = (id: string) => {
    onChange(
      value.filter((item) => !(item.type === "custom" && item.id === id)),
    );
  };

  return (
    <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <SortableItem
            key={item.type === "fixed" ? item.key : item.id}
            item={item}
            index={index}
            onRemove={
              item.type === "custom"
                ? () => handleRemoveCustom(item.id)
                : undefined
            }
          />
        ))}
      </div>
    </DragDropProvider>
  );
}

export function buildSectionOrderItems(
  sectionOrder: { key: string; id?: string | null }[] | null | undefined,
  customSectionLabels: Record<string, string>,
): SectionOrderItem[] {
  const fixedKeys = new Set<string>(FIXED_SECTION_KEYS);

  function isFixedKey(k: string): k is FixedSectionKey {
    return fixedKeys.has(k);
  }

  const stored: SectionOrderItem[] = (sectionOrder ?? [])
    .map((s): SectionOrderItem | null => {
      if (isFixedKey(s.key)) {
        return { type: "fixed", key: s.key, label: fixedSectionLabels[s.key] };
      }
      const label = customSectionLabels[s.key];
      if (!label) return null;
      return { type: "custom", id: s.key, label };
    })
    .filter((x): x is SectionOrderItem => x !== null);

  // ensure all fixed keys are present
  const presentFixed = new Set<FixedSectionKey>();
  const presentCustomIds = new Set<string>();
  for (const s of stored) {
    if (s.type === "fixed") presentFixed.add(s.key);
    else presentCustomIds.add(s.id);
  }

  const missingFixed: SectionOrderItem[] = FIXED_SECTION_KEYS.filter(
    (k) => !presentFixed.has(k),
  ).map((k) => ({ type: "fixed", key: k, label: fixedSectionLabels[k] }));

  // ensure all custom sections are present (append missing ones at end)
  const missingCustom: SectionOrderItem[] = Object.entries(customSectionLabels)
    .filter(([id]) => !presentCustomIds.has(id))
    .map(([id, label]) => ({ type: "custom" as const, id, label }));

  return [...stored, ...missingFixed, ...missingCustom];
}

export function sectionOrderItemsToPayload(
  items: SectionOrderItem[],
): { key: string }[] {
  return items.map((item) => ({
    key: item.type === "fixed" ? item.key : item.id,
  }));
}
