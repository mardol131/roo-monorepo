"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/app/components/ui/atoms/button";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import InputLabel from "@/app/components/ui/atoms/input-label";
import Text from "@/app/components/ui/atoms/text";
import { ChevronDown, Copy, Trash2 } from "lucide-react";

interface RepeaterFieldProps<T extends Record<string, unknown>> {
  label: string;
  fields: T[];
  onAppend: () => void;
  onRemove: (index: number) => void;
  onDuplicate?: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addButtonLabel?: string;
  maxItems?: number;
  error?: string;
  collapsible?: boolean;
  getItemLabel?: (item: T, index: number) => string;
  getItemSubLabel?: (item: T, index: number) => string | undefined;
}

export default function RepeaterField<T extends Record<string, unknown>>({
  label,
  fields,
  onAppend,
  onRemove,
  onDuplicate,
  renderItem,
  addButtonLabel = "Přidat",
  maxItems,
  error,
  collapsible,
  getItemLabel,
  getItemSubLabel,
}: RepeaterFieldProps<T>) {
  const canAdd = maxItems === undefined || fields.length < maxItems;
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const prevLengthRef = useRef(fields.length);
  const userAppendedRef = useRef(false);

  useEffect(() => {
    if (!collapsible) return;
    if (fields.length > prevLengthRef.current && userAppendedRef.current) {
      const lastItem = fields[fields.length - 1];
      setOpenIds((prev) => new Set([...prev, lastItem.id as string]));
    }
    prevLengthRef.current = fields.length;
    userAppendedRef.current = false;
  }, [fields, collapsible]);

  function toggleItem(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <InputLabel label={label} />
      {fields.length > 0 && (
        <div className="flex flex-col gap-3">
          {fields.map((item, index) => {
            const id = item.id as string;
            const isOpen = !collapsible || openIds.has(id);
            const itemLabel = getItemLabel
              ? getItemLabel(item, index)
              : `${label} #${index + 1}`;
            const itemSubLabel = getItemSubLabel
              ? getItemSubLabel(item, index)
              : undefined;

            return (
              <div
                key={id}
                className="rounded-lg border border-zinc-200 bg-zinc-50"
              >
                {collapsible ? (
                  <div className="flex items-center gap-2 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleItem(id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <ChevronDown
                        size={16}
                        className={[
                          "shrink-0 text-zinc-400 transition-transform duration-200",
                          isOpen ? "rotate-180" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      <div className="min-w-0">
                        <Text variant="label-lg" as="span">
                          {itemLabel}
                        </Text>
                        {itemSubLabel && (
                          <Text
                            variant="caption"
                            color="textLight"
                            className="block"
                            as="span"
                          >
                            {itemSubLabel}
                          </Text>
                        )}
                      </div>
                    </button>
                    {onDuplicate && (
                      <button
                        type="button"
                        onClick={() => { userAppendedRef.current = true; onDuplicate(index); }}
                        className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-danger-surface hover:text-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="relative flex flex-col gap-3 p-4">
                    <div className="absolute right-3 top-3 flex gap-1">
                      {onDuplicate && (
                        <button
                          type="button"
                          onClick={() => { userAppendedRef.current = true; onDuplicate(index); }}
                          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-danger-surface hover:text-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {renderItem(item, index)}
                  </div>
                )}
                {collapsible && isOpen && (
                  <div className="border-t border-zinc-200 p-4">
                    {renderItem(item, index)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {canAdd && (
        <div>
          <Button
            htmlType="button"
            text={addButtonLabel}
            version="plain"
            onClick={() => { userAppendedRef.current = true; onAppend(); }}
            iconLeft="Plus"
            size="sm"
          />
        </div>
      )}
      {error && <ErrorText error={error} />}
    </div>
  );
}
