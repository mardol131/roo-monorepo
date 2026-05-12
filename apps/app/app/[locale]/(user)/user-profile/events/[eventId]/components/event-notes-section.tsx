"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import {
  useAddEventNote,
  useRemoveEventNote,
} from "@/app/react-query/events/hooks";
import type { Event } from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { NotebookPen, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  eventId: string;
  notes: NonNullable<Event["notes"]>;
};

export default function EventNotesSection({ eventId, notes }: Props) {
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const { mutate, isPending } = useAddEventNote(eventId);
  const { mutate: removeNote, isPending: isRemoving } =
    useRemoveEventNote(eventId);

  function submit() {
    const trimmed = note.trim();
    if (!trimmed) return;
    mutate(
      { note: trimmed, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setNote("");
          setDescription("");
          setFormOpen(false);
        },
      },
    );
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

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

      {sorted.length > 0 && (
        <ul className="px-6 py-4 flex flex-col gap-2">
          {sorted.map((n, i) => (
            <NoteCard
              key={n.id ?? i}
              n={n}
              onDelete={n.id ? () => removeNote(n.id!) : undefined}
              isRemoving={isRemoving}
            />
          ))}
        </ul>
      )}

      {/* Add note */}
      <div className="px-6 py-4 border-t border-zinc-100">
        {formOpen ? (
          <div className="flex flex-col items-end gap-3">
            <div className="w-full flex flex-col gap-2">
              <Input
                label=""
                placeholder="Název poznámky"
                disabled={isPending}
                inputProps={{
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && submit(),
                  autoFocus: true,
                }}
              />
              <Input
                label=""
                placeholder="Popis (volitelný)"
                disabled={isPending}
                inputProps={{
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                text="Zrušit"
                version="plain"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setFormOpen(false);
                  setNote("");
                  setDescription("");
                }}
              />
              <Button
                text="Přidat poznámku"
                iconLeft="Plus"
                version="eventFull"
                size="sm"
                disabled={isPending || !note.trim()}
                loading={isPending}
                onClick={submit}
              />
            </div>
          </div>
        ) : (
          <Button
            text="Přidat poznámku"
            iconLeft="Plus"
            version="plain"
            size="sm"
            onClick={() => setFormOpen(true)}
          />
        )}
      </div>
    </div>
  );
}

function NoteCard({
  n,
  onDelete,
  isRemoving,
}: {
  n: NonNullable<Event["notes"]>[number];
  onDelete?: () => void;
  isRemoving: boolean;
}) {
  return (
    <li className="flex items-start gap-3 bg-amber-50 border-l-4 border-amber-300 rounded-r-xl px-4 py-3">
      <div className="flex-1 flex flex-col gap-0.5">
        <Text variant="body-sm" color="textDark" className="leading-relaxed">
          {n.note}
        </Text>
        {n.description && (
          <Text variant="caption" color="secondary">
            {n.description}
          </Text>
        )}
        <Text variant="caption" color="secondary" className="mt-1 opacity-60">
          {format(new Date(n.createdAt), "d. M. yyyy HH:mm", { locale: cs })}
        </Text>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isRemoving}
          className="shrink-0 mt-0.5 text-amber-300 hover:text-danger transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </li>
  );
}
