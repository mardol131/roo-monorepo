import Text from "@/app/components/ui/atoms/text";

export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2.5 border-b border-zinc-100 last:border-0">
      <Text variant="label" color="secondary">
        {label}
      </Text>
      <div>{children}</div>
    </div>
  );
}
