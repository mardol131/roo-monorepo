import { Check, X } from "lucide-react";

export function BoolBadge({ value }: { value: boolean | null | undefined }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
      <Check className="w-3.5 h-3.5" /> Ano
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400">
      <X className="w-3.5 h-3.5" /> Ne
    </span>
  );
}
