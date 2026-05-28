"use client";

import Button from "@/app/components/ui/atoms/button";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { useInquiriesByListing } from "@/app/react-query/inquiries/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { CalendarEvent, Inquiry, Space } from "@roo/common";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type EventFormData = {
  name: string;
  status: CalendarEvent["status"];
  startsAt: string;
  endsAt: string;
  description?: string;
  spaces?: string[];
  inquiry?: string | null;
};

type Props = {
  isOpen: boolean;
  mode: "create" | "edit";
  event?: CalendarEvent;
  initialStartsAt?: Date;
  initialEndsAt?: Date;
  listingId: string;
  onSubmit: (data: EventFormData) => void;
  onDelete?: () => void;
  onClose: () => void;
  isPending: boolean;
  error?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getId(val: string | { id: string } | null | undefined): string {
  if (!val) return "";
  return typeof val === "string" ? val : val.id;
}

// ── Status pills ──────────────────────────────────────────────────────────────

const STATUS_OPTIONS: {
  value: CalendarEvent["status"];
  label: string;
  active: string;
  idle: string;
}[] = [
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

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalendarEventModal({
  isOpen,
  mode,
  event,
  initialStartsAt,
  initialEndsAt,
  listingId,
  onSubmit,
  onDelete,
  onClose,
  isPending,
  error,
}: Props) {
  const { data: spacesData } = useSpacesByListing(listingId);
  const { data: inquiriesData } = useInquiriesByListing(listingId);
  const spaces = spacesData?.docs ?? [];
  const inquiries = inquiriesData?.docs ?? [];

  const [name, setName] = useState(event?.name ?? "");
  const [status, setStatus] = useState<CalendarEvent["status"]>(
    event?.status ?? "tentative",
  );
  const [startsAt, setStartsAt] = useState<string | null>(
    event?.startsAt ?? initialStartsAt?.toISOString() ?? null,
  );
  const [endsAt, setEndsAt] = useState<string | null>(
    event?.endsAt ?? initialEndsAt?.toISOString() ?? null,
  );
  const [description, setDescription] = useState(event?.description ?? "");
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(
    (event?.spaces ?? []).map((s) => getId(s as Space | string)),
  );
  const [inquiryId, setInquiryId] = useState(
    getId(event?.inquiry as Inquiry | string | null | undefined),
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleSpace(id: string) {
    setSelectedSpaces((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      status,
      startsAt: startsAt ? new Date(startsAt).toISOString() : "",
      endsAt: endsAt ? new Date(endsAt).toISOString() : "",
      description: description || undefined,
      spaces: selectedSpaces.length ? selectedSpaces : undefined,
      inquiry: inquiryId || null,
    });
  }

  const isInquiryEvent = mode === "edit" && event?.source === "inquiry";
  const title =
    mode === "create"
      ? "Nová událost"
      : isInquiryEvent
        ? "Událost poptávky"
        : "Upravit událost";

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      header={title}
      maxWidth="max-w-lg"
      errorMessage={error}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <Input
          label="Název"
          isRequired
          inputProps={{
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Název události...",
            autoFocus: true,
          }}
        />

        {/* Fields hidden for inquiry events */}
        {!isInquiryEvent && (
          <>
            {/* Time range */}
            <div className="grid grid-cols-2 gap-3">
              <DateTimeInput
                label="Začátek"
                value={startsAt}
                onChange={setStartsAt}
              />
              <DateTimeInput
                label="Konec"
                min={startsAt || undefined}
                value={endsAt}
                onChange={setEndsAt}
              />
            </div>

            {/* Status */}
            <Field label="Stav">
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                      status === opt.value ? opt.active : opt.idle
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Inquiry */}
            <SelectInput
              label="Poptávka"
              value={inquiryId}
              onChange={(e) => setInquiryId(e.target.value)}
              placeholder="— bez poptávky —"
              items={inquiries.map((inq) => {
                const user =
                  typeof inq.user === "object" && inq.user !== null
                    ? (inq.user as { firstName?: string; lastName?: string })
                    : null;
                const userName = user
                  ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                  : "";
                return {
                  value: inq.id,
                  label: `#${inq.id.slice(-6)}${userName ? ` — ${userName}` : ""}`,
                };
              })}
            />
          </>
        )}

        {/* Spaces */}
        {!isInquiryEvent && spaces.length > 0 && (
          <Field label="Prostory">
            <div className="flex flex-col gap-2 border border-zinc-200 rounded-lg p-3">
              {spaces.map((space) => (
                <label
                  key={space.id}
                  className="flex items-center gap-2.5 text-sm text-zinc-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSpaces.includes(space.id)}
                    onChange={() => toggleSpace(space.id)}
                    className="accent-calendar rounded"
                  />
                  {space.name}
                </label>
              ))}
            </div>
          </Field>
        )}

        {/* Description */}
        <Textarea
          label="Poznámka"
          inputProps={{
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Interní poznámka...",
            rows: 3,
          }}
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          {mode === "edit" && onDelete ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Opravdu smazat?</span>
                <Button
                  version="dangerFull"
                  text="Smazat"
                  size="xs"
                  rounding="lg"
                  onClick={onDelete}
                  disabled={isPending}
                />
                <Button
                  version="plain"
                  text="Ne"
                  size="xs"
                  rounding="lg"
                  onClick={() => setConfirmDelete(false)}
                />
              </div>
            ) : (
              <Button
                version="danger"
                text="Smazat"
                size="xs"
                rounding="lg"
                iconLeft="Trash2"
                onClick={() => setConfirmDelete(true)}
              />
            )
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button
              version="plain"
              text="Zrušit"
              size="sm"
              rounding="lg"
              onClick={onClose}
            />
            <Button
              version="calendar"
              text={mode === "create" ? "Vytvořit" : "Uložit"}
              size="sm"
              rounding="lg"
              htmlType="submit"
              disabled={isPending || !name.trim()}
              loading={isPending}
            />
          </div>
        </div>
      </form>
    </ModalLayout>
  );
}
