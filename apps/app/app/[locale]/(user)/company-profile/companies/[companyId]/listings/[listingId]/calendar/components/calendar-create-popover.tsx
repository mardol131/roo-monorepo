"use client";

import { useClickOutside } from "@/app/hooks/use-click-outside";
import { CalendarEvent } from "@roo/common";
import { format, isSameDay } from "date-fns";
import { cs } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  startsAt: Date;
  endsAt: Date;
  position: { x: number; y: number };
  onSubmit: (name: string, status: CalendarEvent["status"]) => void;
  onClose: () => void;
  isPending?: boolean;
  error?: string;
};

// ── Status pills ──────────────────────────────────────────────────────────────

type StatusOption = {
  value: CalendarEvent["status"];
  label: string;
  active: string;
  idle: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "confirmed",
    label: "Potvrzeno",
    active: "bg-calendar text-white",
    idle: "bg-zinc-100 text-zinc-600 hover:bg-calendar/10 hover:text-calendar",
  },
  {
    value: "tentative",
    label: "V plánování",
    active:
      "bg-calendar-surface text-calendar border border-dashed border-calendar",
    idle: "bg-zinc-100 text-zinc-600 hover:bg-calendar-surface hover:text-calendar",
  },
  {
    value: "cancelled",
    label: "Zrušeno",
    active: "bg-zinc-300 text-zinc-600",
    idle: "bg-zinc-100 text-zinc-500 hover:bg-zinc-200",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRange(startsAt: Date, endsAt: Date): string {
  if (isSameDay(startsAt, endsAt)) {
    return `${format(startsAt, "d. M., HH:mm", { locale: cs })} – ${format(endsAt, "HH:mm", { locale: cs })}`;
  }
  return `${format(startsAt, "d. M. HH:mm", { locale: cs })} – ${format(endsAt, "d. M. HH:mm", { locale: cs })}`;
}

const POPOVER_W = 260;
const POPOVER_H = 196; // estimated height for vertical centering
const GAP = 8; // gap between event block and popover

function resolvePosition(x: number, y: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Default: open to the right of x
  let left = x + GAP;
  if (left + POPOVER_W > vw - 8) {
    // Flip to the left
    left = x - POPOVER_W - GAP;
  }

  // Vertically centered on y, clamped to viewport
  let top = y - POPOVER_H / 2;
  top = Math.max(8, Math.min(top, vh - POPOVER_H - 8));

  return { left, top };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalendarCreatePopover({
  startsAt,
  endsAt,
  position,
  onSubmit,
  onClose,
  isPending,
  error,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<CalendarEvent["status"]>("confirmed");

  useClickOutside(ref, onClose);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      inputRef.current?.focus();
      return;
    }
    onSubmit(name.trim(), status);
  }

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 flex flex-col gap-3"
      style={{ ...resolvePosition(position.x, position.y), width: POPOVER_W }}
    >
      {/* Time range */}
      <p className="text-[11px] font-medium text-zinc-400 leading-none">
        {formatRange(startsAt, endsAt)}
      </p>

      {/* Name input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název události..."
          className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-calendar focus:ring-2 focus:ring-calendar/20 placeholder:text-zinc-400"
        />

        {/* Status pills */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                status === opt.value ? opt.active : opt.idle
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Overlap error */}
        {error && (
          <p className="text-[11px] text-red-500 leading-tight">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-0.5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-700 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Zrušit
          </button>
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="text-xs font-medium bg-calendar text-white px-3 py-1.5 rounded-lg hover:bg-calendar/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Přidat
          </button>
        </div>
      </form>
    </div>
  );
}
