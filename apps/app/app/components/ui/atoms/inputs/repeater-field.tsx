"use client";

import React from "react";
import Button from "@/app/components/ui/atoms/button";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import InputLabel from "@/app/components/ui/atoms/input-label";
import { Trash2 } from "lucide-react";

interface RepeaterFieldProps<T extends Record<string, unknown>> {
  label: string;
  fields: T[];
  onAppend: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addButtonLabel?: string;
  maxItems?: number;
  error?: string;
}

export default function RepeaterField<T extends Record<string, unknown>>({
  label,
  fields,
  onAppend,
  onRemove,
  renderItem,
  addButtonLabel = "Přidat",
  maxItems,
  error,
}: RepeaterFieldProps<T>) {
  const canAdd = maxItems === undefined || fields.length < maxItems;

  return (
    <div className="flex flex-col gap-3">
      <InputLabel label={label} />
      {fields.length > 0 && (
        <div className="flex flex-col gap-3">
          {fields.map((item, index) => (
            <div
              key={(item as Record<string, unknown>).id as string}
              className="relative flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-3 top-3 rounded-md p-1 text-zinc-400 transition-colors hover:bg-danger-surface hover:text-danger"
              >
                <Trash2 size={16} />
              </button>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
      {canAdd && (
        <div>
          <Button
            htmlType="button"
            text={addButtonLabel}
            version="plain"
            onClick={onAppend}
            iconLeft="Plus"
            size="sm"
          />
        </div>
      )}
      {error && <ErrorText error={error} />}
    </div>
  );
}
