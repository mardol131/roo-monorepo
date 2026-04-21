import Text from "@/app/components/ui/atoms/text";

export function FormSection({
  id,
  icon,
  title,
  subtitle,
  children,
  surfaceColor = "bg-primary-surface",
  color = "text-primary",
  error,
}: {
  id?: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  surfaceColor?: string;
  color?: string;
  error?: boolean;
}) {
  const Icon = icon;
  return (
    <div
      id={id}
      className={`bg-white rounded-2xl border ${error ? "border-red-500" : "border-zinc-200"} scroll-mt-6`}
    >
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-xl ${surfaceColor} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="flex flex-col">
          <Text variant="label1" color="dark" className="font-semibold">
            {title}
          </Text>

          {subtitle && (
            <Text variant="label2" color="dark" className="font-medium">
              {subtitle}
            </Text>
          )}
        </div>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}
