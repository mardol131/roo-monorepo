"use client";

import Button from "@/app/components/ui/atoms/button";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { useUpdateChecklist } from "@/app/react-query/events/hooks";
import type { Event } from "@roo/common";
import { CheckSquare } from "lucide-react";
import { useState } from "react";
import ChecklistItemRow from "./checklist-item-row";

type Props = {
  eventId: string;
  checklist: NonNullable<Event["checklist"]>;
};

export default function EventChecklistSection({ eventId, checklist }: Props) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const { mutate, isPending } = useUpdateChecklist(eventId);

  function toggle(item: NonNullable<Event["checklist"]>[number]) {
    const updated = checklist.map((i) =>
      i.id === item.id ? { ...i, completed: !i.completed } : i,
    );
    mutate(updated);
  }

  function remove(item: NonNullable<Event["checklist"]>[number]) {
    mutate(checklist.filter((i) => i.id !== item.id));
  }

  function addItem() {
    const trimmed = label.trim();
    if (!trimmed) return;
    mutate(
      [
        ...checklist,
        {
          label: trimmed,
          description: description.trim() || undefined,
          dueDate: dueDate?.toISOString() ?? undefined,
          completed: false,
        },
      ],
      {
        onSuccess: () => {
          setLabel("");
          setDescription("");
          setDueDate(null);
        },
      },
    );
  }

  const done = checklist.filter((i) => i.completed).length;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckSquare className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex flex-col items-start">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            Úkoly
          </Text>
          <Text variant="caption" color="secondary">
            {checklist.length === 0
              ? "Žádné položky"
              : `${done} / ${checklist.length} splněno`}
          </Text>
        </div>
      </div>

      {/* Items */}
      {checklist.length > 0 && (
        <div className="divide-y divide-zinc-50">
          {checklist.map((item, i) => (
            <ChecklistItemRow
              key={item.id ?? i}
              item={item}
              onToggle={() => toggle(item)}
              onDelete={() => remove(item)}
              disabled={isPending}
            />
          ))}
        </div>
      )}

      {/* Add item */}
      <div className="px-6 py-4 flex flex-col gap-2 border-t border-zinc-100">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              label=""
              disabled={isPending}
              inputProps={{
                value: label,
                placeholder: "Název položky…",
                onChange: (e) => setLabel(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && addItem(),
              }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label=""
              disabled={isPending}
              inputProps={{
                value: description,
                placeholder: "Popis (volitelný)…",
                onChange: (e) => setDescription(e.target.value),
              }}
            />
          </div>
          <div className="flex-1">
            <DateTimeInput
              label=""
              value={dueDate}
              onChange={setDueDate}
              placeholder="Termín (volitelný)…"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            text="Přidat úkol"
            iconLeft="Plus"
            version="eventFull"
            size="sm"
            disabled={isPending || !label.trim()}
            loading={isPending}
            onClick={addItem}
          />
        </div>
      </div>
    </div>
  );
}
