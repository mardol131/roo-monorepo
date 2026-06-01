"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import type { Event } from "@roo/common";
import { useEffect, useState } from "react";

type Note = NonNullable<Event["notes"]>[number];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => void;
  initialValues?: Note;
  isLoading?: boolean;
};

export default function NoteModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isLoading,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  useEffect(() => {
    if (isOpen) {
      setTitle(initialValues?.title ?? "");
      setDescription(initialValues?.description ?? "");
    }
  }, [isOpen, initialValues]);

  const isEditing = !!initialValues;

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({ title: trimmed, description: description.trim() || undefined });
  }

  return (
    <ModalLayout
      header={isEditing ? "Upravit poznámku" : "Přidat poznámku"}
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Poznámka"
          isRequired
          disabled={isLoading}
          placeholder="Text poznámky"
          inputProps={{
            value: title,
            onChange: (e) => setTitle(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleSubmit(),
            autoFocus: true,
          }}
        />

        <Textarea
          label="Popis"
          inputProps={{
            placeholder: "Volitelný popis",
            value: description,
            onChange: (e) => setDescription(e.target.value),
          }}
          maxLength={500}
          height="h-32"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            text="Zrušit"
            version="plain"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
          />
          <Button
            text={isEditing ? "Uložit" : "Přidat poznámku"}
            iconLeft={isEditing ? "Save" : "Plus"}
            version="eventFull"
            size="sm"
            disabled={isLoading || !title.trim()}
            loading={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </ModalLayout>
  );
}
