"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { useAddEventNote, useRemoveEventNote } from "@/app/react-query/events/hooks";
import type { Event } from "@roo/common";
import { NotebookPen, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  eventId: string;
  notes: NonNullable<Event["notes"]>;
};

export default function EventNotesSection({ eventId, notes }: Props) {
  const [value, setValue] = useState("");
  const { mutate, isPending } = useAddEventNote(eventId);
  const { mutate: removeNote, isPending: isRemoving } = useRemoveEventNote(eventId);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    mutate(trimmed, { onSuccess: () => setValue("") });
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <NotebookPen className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex flex-col items-start">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            Poznámky
          </Text>
          <Text variant="caption" color="secondary">
            {notes.length === 0 ? "Žádné poznámky" : `${notes.length} poznámek`}
          </Text>
        </div>
      </div>

      {/* Notes list */}
      {notes.length > 0 && (
        <ul className="divide-y divide-zinc-50">
          {notes.map((n, i) => (
            <li key={n.id ?? i} className="px-6 py-3 flex items-center gap-3">
              <Text variant="body-sm" color="textDark" className="flex-1">
                {n.note}
              </Text>
              {n.id && (
                <button
                  type="button"
                  onClick={() => removeNote(n.id!)}
                  disabled={isRemoving}
                  className="shrink-0 text-zinc-300 hover:text-danger transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add note */}
      <div className="px-6 py-4 flex flex-col items-end gap-3 border-t border-zinc-100">
        <div className="flex-1 w-full">
          <Input
            label=""
            disabled={isPending}
            inputProps={{
              value,
              placeholder: "Přidat poznámku…",
              onChange: (e) => setValue(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && submit(),
            }}
          />
        </div>
        <Button
          text="Přidat poznámku"
          iconLeft="Plus"
          version="eventFull"
          size="sm"
          disabled={isPending || !value.trim()}
          loading={isPending}
          onClick={submit}
        />
      </div>
    </div>
  );
}
