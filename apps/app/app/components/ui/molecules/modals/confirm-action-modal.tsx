"use client";

import React from "react";
import ModalLayout from "../modal-layout";
import { Dot, X } from "lucide-react";
import Text, { TextProps } from "../../atoms/text";
import Input from "../../atoms/inputs/input";
import Button, { ButtonProps } from "../../atoms/button";
import { createEvents } from "@/app/functions/create-events";

type ModalConfig = {
  onConfirmClick: () => Promise<void>;
  confirmPhrase?: string;
  whatIsGoingToHappenList: string[];
  whatIsGoingToHappenText: string;
  whatIsGoingToHappenTextColor?: TextProps["color"];
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  buttonVersion: ButtonProps["version"];
  buttonText: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

type ConfirmActionModalEvents = {
  open: ModalConfig;
};

export const confirmActionModalEvents =
  createEvents<ConfirmActionModalEvents>();

export function ConfirmActionModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<ModalConfig | null>(null);
  const [confirmText, setConfirmText] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  confirmActionModalEvents.useListener({
    event: "open",
    handler: (payload) => {
      setConfig(payload);
      setConfirmText("");
      setIsProcessing(false);
      setError(null);
      setIsOpen(true);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setConfirmText("");
    setError(null);
  };

  const handleConfirm = async () => {
    if (!config) return;
    setError(null);
    setIsProcessing(true);
    try {
      await config.onConfirmClick();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nastala chyba. Zkuste to znovu.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!config) return null;

  const {
    confirmPhrase,
    whatIsGoingToHappenList,
    whatIsGoingToHappenText,
    whatIsGoingToHappenTextColor,
    bgColor,
    textColor,
    buttonVersion,
    buttonText,
    title,
    description,
    Icon,
    borderColor,
  } = config;

  return (
    <ModalLayout
      header={
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgColor} shrink-0`}
          >
            <Icon className={`w-4.5 h-4.5 ${textColor}`} />
          </div>
          <div>
            <Text variant="h4" color="textDark">
              {title}
            </Text>
            <Text variant="caption" color="secondary">
              {description}
            </Text>
          </div>
        </div>
      }
      isOpen={isOpen}
      onClose={handleClose}
      disableClose={isProcessing}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div
          className={`${bgColor} border ${borderColor || "border-zinc-200"} rounded-xl p-4 flex flex-col gap-1.5`}
        >
          <Text variant="label-lg" color={whatIsGoingToHappenTextColor}>
            {whatIsGoingToHappenText}
          </Text>
          <ul className="flex flex-col gap-1">
            {whatIsGoingToHappenList.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Dot className={`w-6 h-6 ${textColor} mt-0.5 shrink-0`} />
                <Text variant="body-sm" color="textDark">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </div>
        {confirmPhrase && (
          <div className="flex flex-col gap-1.5">
            <Text variant="label-lg" color="textDark">
              Pro potvrzení napište:{" "}
              <span className="font-mono text-red-600">{confirmPhrase}</span>
            </Text>
            <Input
              label=""
              inputProps={{
                value: confirmText,
                onChange: (e) => setConfirmText(e.target.value),
                placeholder: confirmPhrase,
              }}
            />
          </div>
        )}
        {error && (
          <Text variant="body-sm" color="danger">
            {error}
          </Text>
        )}
        <Button
          text={buttonText}
          version={buttonVersion}
          iconLeft="Trash2"
          loading={isProcessing}
          disabled={
            confirmPhrase
              ? confirmText.trim().toLowerCase() !==
                  confirmPhrase.toLowerCase() || isProcessing
              : isProcessing
          }
          onClick={handleConfirm}
          className="w-full"
        />
      </div>
    </ModalLayout>
  );
}
