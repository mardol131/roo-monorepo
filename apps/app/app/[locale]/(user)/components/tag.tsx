import Text from "@/app/components/ui/atoms/text";

export function getName(item: string | { name: string }): string {
  return typeof item === "string" ? item : item.name;
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">
      {label}
    </span>
  );
}

export function TagList({
  items,
}: {
  items: (string | { name: string })[] | null | undefined;
}) {
  if (!items?.length)
    return (
      <Text variant="body-sm" color="textLight">
        —
      </Text>
    );
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <Tag key={i} label={getName(item)} />
      ))}
    </div>
  );
}
