"use client";

import Button from "@/app/components/ui/atoms/button";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import type { Event } from "@roo/common";
import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

type ChecklistItem = NonNullable<Event["checklist"]>[number];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ChecklistItem, "id">) => void;
  initialValues?: ChecklistItem;
  isLoading?: boolean;
};

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isLoading,
}: Props) {
  const [label, setLabel] = useState(initialValues?.label ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [dueDate, setDueDate] = useState<string | null>(
    initialValues?.dueDate ?? null,
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialValues?.priority ?? "medium",
  );

  useEffect(() => {
    if (isOpen) {
      setLabel(initialValues?.label ?? "");
      setDescription(initialValues?.description ?? "");
      setDueDate(initialValues?.dueDate ?? null);
      setPriority(initialValues?.priority ?? "medium");
    }
  }, [isOpen, initialValues]);

  const isEditing = !!initialValues;

  function handleClose() {
    onClose();
  }

  function handleSubmit() {
    const trimmed = label.trim();
    if (!trimmed) return;
    onSubmit({
      label: trimmed,
      description: description.trim() || undefined,
      dueDate: dueDate ?? undefined,
      completed: initialValues?.completed ?? false,
      priority,
      status: initialValues?.status ?? "active",
    });
  }

  return (
    <ModalLayout
      header={isEditing ? "Upravit úkol" : "Přidat úkol"}
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Název"
          isRequired
          disabled={isLoading}
          placeholder="Název úkolu"
          inputProps={{
            value: label,
            onChange: (e) => setLabel(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleSubmit(),
            autoFocus: true,
          }}
        />

        <Input
          label="Poznámka"
          disabled={isLoading}
          placeholder="Volitelná poznámka"
          inputProps={{
            value: description,
            onChange: (e) => setDescription(e.target.value),
          }}
          maxLength={150}
        />

        <DateTimeInput
          label="Termín"
          value={dueDate}
          onChange={setDueDate}
          placeholder="Volitelný termín…"
          dateOnly
          calendarPosition="fixed"
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700">Priorita</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPriority("low")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${priority === "low" ? "bg-success text-white" : "bg-success-surface text-success"}`}
            >
              <CircleCheck className="w-3.5 h-3.5" />
              Nízká
            </button>
            <button
              type="button"
              onClick={() => setPriority("medium")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${priority === "medium" ? "bg-warning text-white" : "bg-warning-surface text-warning"}`}
            >
              <TriangleAlert className="w-3.5 h-3.5" />
              Střední
            </button>
            <button
              type="button"
              onClick={() => setPriority("high")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${priority === "high" ? "bg-danger text-white" : "bg-danger-surface text-danger"}`}
            >
              <CircleAlert className="w-3.5 h-3.5" />
              Vysoká
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            text="Zrušit"
            version="plain"
            size="sm"
            disabled={isLoading}
            onClick={handleClose}
          />
          <Button
            text={isEditing ? "Uložit" : "Přidat úkol"}
            iconLeft={isEditing ? "Save" : "Plus"}
            version="eventFull"
            size="sm"
            disabled={isLoading || !label.trim()}
            loading={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </ModalLayout>
  );
}
