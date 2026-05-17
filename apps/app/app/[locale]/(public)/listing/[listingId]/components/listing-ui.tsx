import Text from "@/app/components/ui/atoms/text";
import React from "react";

export function Chip({ label }: { label: string }) {
  return (
    <Text
      as="span"
      variant="caption"
      color="textDark"
      className="inline-block px-3 py-1.5 border border-zinc-200 bg-white rounded-md tracking-wider"
    >
      {label}
    </Text>
  );
}

export function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item} label={item} />
      ))}
    </div>
  );
}

export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary shrink-0 mt-0.5">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <Text
          as="span"
          variant="caption"
          color="textLight"
          className="uppercase tracking-widest font-semibold"
        >
          {label}
        </Text>
        <Text
          as="span"
          variant="label-lg"
          color="textDark"
          className="font-semibold"
        >
          {value}
        </Text>
      </div>
    </div>
  );
}

export function resolveNames<T extends { name: string }>(
  items: (string | T)[],
): string[] {
  return items
    .filter((item): item is T => typeof item !== "string")
    .map((item) => item.name);
}
