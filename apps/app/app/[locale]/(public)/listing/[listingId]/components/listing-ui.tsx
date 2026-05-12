import Text from "@/app/components/ui/atoms/text";
import React from "react";

export function Chip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium whitespace-nowrap">
      {label}
    </span>
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
    <div className="flex items-center gap-3">
      <div className="text-zinc-400 shrink-0">{icon}</div>
      <div className="flex items-baseline gap-2">
        <Text variant="label" color="secondary">
          {label}
        </Text>
        <Text variant="label-lg" color="textDark">
          {value}
        </Text>
      </div>
    </div>
  );
}

export function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="h4" color="textDark">
        {title}
      </Text>
      {children}
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
