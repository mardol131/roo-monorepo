import * as lucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function InfoItem({ icon, text }: { icon: string; text: string }) {
  const Icon =
    (lucideIcons[icon as keyof typeof lucideIcons] as LucideIcon) ??
    lucideIcons.Info;
  return (
    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {text}
    </span>
  );
}
