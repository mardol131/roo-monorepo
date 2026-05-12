"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import { createEvents } from "@/app/functions/create-events";
import { useState } from "react";
import ModalLayout from "../modal-layout";

type ModalConfig = {
  header: string;
  description: React.ReactNode;
  confirmLabel: string;
  confirmVersion?: ButtonProps["version"];
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
};

type SimpleConfirmActionModalEvents = {
  open: ModalConfig;
};

export const simpleConfirmActionModalEvents =
  createEvents<SimpleConfirmActionModalEvents>();

export function SimpleConfirmActionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  simpleConfirmActionModalEvents.useListener({
    event: "open",
    handler: (payload) => {
      setConfig(payload);
      setIsProcessing(false);
      setError(null);
      setIsOpen(true);
    },
  });

  function handleClose() {
    setIsOpen(false);
    setError(null);
  }

  async function handleConfirm() {
    if (!config) return;
    setError(null);
    setIsProcessing(true);
    try {
      await config.onConfirm();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala chyba. Zkuste to znovu.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (!config) return null;

  return (
    <ModalLayout
      header={config.header}
      isOpen={isOpen}
      onClose={handleClose}
      disableClose={isProcessing}
      errorMessage={error ?? undefined}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-600">{config.description}</p>
        <div className="flex justify-end gap-3">
          <Button
            htmlType="button"
            text={config.cancelLabel ?? "Zrušit"}
            version="plain"
            onClick={handleClose}
            disabled={isProcessing}
          />
          <Button
            htmlType="button"
            text={config.confirmLabel}
            version={config.confirmVersion ?? "primary"}
            loading={isProcessing}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </ModalLayout>
  );
}
