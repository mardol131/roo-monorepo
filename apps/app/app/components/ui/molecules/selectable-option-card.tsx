"use client";

import { Check } from "lucide-react";

interface SelectableOptionCardProps {
  isActive: boolean;
  onClick?: () => void;
  disabled?: boolean;
  price: React.ReactNode;
  children: React.ReactNode;
}

export default function SelectableOptionCard({
  isActive,
  onClick,
  disabled,
  price,
  children,
}: SelectableOptionCardProps) {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border transition-all ${
        disabled
          ? "border-zinc-100 bg-zinc-50 opacity-70"
          : isActive
            ? "border-success bg-success-surface"
            : "border-zinc-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 text-left disabled:cursor-not-allowed">
        {!disabled && (
          <div
            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
              isActive ? "bg-success" : "border-2 border-zinc-300"
            }`}
          >
            {isActive && (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            )}
          </div>
        )}
        {children}
      </div>

      <div className="flex items-center gap-3 shrink-0">{price}</div>
    </button>
  );
}
