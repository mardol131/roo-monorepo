"use client";

import Button from "@/app/components/ui/atoms/button";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { useUpdateChecklist } from "@/app/react-query/events/hooks";
import type { Event } from "@roo/common";
import {
  ArrowDown,
  ArrowUp,
  CheckSquare,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Minus,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import ChecklistItemRow from "./checklist-item-row";

type Props = {
  eventId: string;
  checklist: NonNullable<Event["checklist"]>;
};

export default function EventChecklistSection({ eventId, checklist }: Props) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [formOpen, setFormOpen] = useState(false);
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
          dueDate: dueDate ?? undefined,
          completed: false,
          priority,
          status: "active",
        },
      ],
      {
        onSuccess: () => {
          setLabel("");
          setDescription("");
          setDueDate(null);
          setPriority("medium");
          setFormOpen(false);
        },
      },
    );
  }

  const [completedOpen, setCompletedOpen] = useState(false);
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortByPriority = (
    a: NonNullable<Event["checklist"]>[number],
    b: NonNullable<Event["checklist"]>[number],
  ) =>
    (priorityOrder[a.priority ?? "medium"] ?? 1) -
    (priorityOrder[b.priority ?? "medium"] ?? 1);
  const pending = checklist.filter((i) => !i.completed).sort(sortByPriority);
  const completed = checklist.filter((i) => i.completed).sort(sortByPriority);
  const done = completed.length;

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

      {/* Pending items */}
      {pending.length > 0 && (
        <div className="divide-y divide-zinc-50 flex flex-col">
          {pending.map((item, i) => (
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

      {/* Completed items */}
      {completed.length > 0 && (
        <div className="border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setCompletedOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-zinc-50 transition-colors"
          >
            <Text variant="caption" color="secondary">
              Splněno ({completed.length})
            </Text>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${completedOpen ? "rotate-180" : ""}`}
            />
          </button>
          {completedOpen && (
            <div className="divide-y divide-zinc-50">
              {completed.map((item, i) => (
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
        </div>
      )}

      {/* Add item */}
      <div className="px-6 py-4 border-t border-zinc-100">
        {formOpen ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <Input
                label=""
                disabled={isPending}
                placeholder="Název položky"
                inputProps={{
                  value: label,
                  onChange: (e) => setLabel(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addItem(),
                  autoFocus: true,
                }}
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  title="Nízká priorita"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${priority === "low" ? "bg-success text-white" : "bg-success-surface text-success"}`}
                >
                  <CircleCheck className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  title="Střední priorita"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${priority === "medium" ? "bg-warning text-white" : "bg-warning-surface text-warning"}`}
                >
                  <TriangleAlert className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("high")}
                  title="Vysoká priorita"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${priority === "high" ? "bg-danger text-white" : "bg-danger-surface text-danger"}`}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                label=""
                disabled={isPending}
                placeholder="Poznámka"
                inputProps={{
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                }}
              />
              <DateTimeInput
                label=""
                value={dueDate}
                onChange={setDueDate}
                placeholder="Termín (volitelný)…"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                text="Zrušit"
                version="plain"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setFormOpen(false);
                  setLabel("");
                  setDescription("");
                  setDueDate(null);
                  setPriority("medium");
                }}
              />
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
        ) : (
          <Button
            text="Přidat úkol"
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
