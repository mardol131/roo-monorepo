"use client";

import React from "react";
import ModalLayout from "../modal-layout";
import Text from "../../atoms/text";
import Input from "../../atoms/inputs/input";
import Button from "../../atoms/button";
import { CircleDollarSign } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  inquiryId: string;
  currentPrice?: number;
};

export function PriceChangeModal({
  isOpen,
  onClose,
  inquiryId,
  currentPrice,
}: Props) {
  const [priceInput, setPriceInput] = React.useState(
    currentPrice ? currentPrice.toString() : "",
  );
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClose = () => {
    setPriceInput(currentPrice ? currentPrice.toString() : "");
    setError(null);
    onClose();
  };

  const parsedPrice = parseFloat(priceInput.replace(",", "."));
  const isValidPrice = !isNaN(parsedPrice) && parsedPrice > 0;

  const handleConfirm = async () => {
    if (!isValidPrice) return;
    setError(null);
    setIsProcessing(true);
    try {
      // TODO: mutation — change price for inquiryId to parsedPrice
      console.log("change price", inquiryId, parsedPrice);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nastala chyba. Zkuste to znovu.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModalLayout
      header={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 shrink-0">
            <CircleDollarSign className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <Text variant="h4" color="textDark">
              Změnit cenu poptávky
            </Text>
            <Text variant="caption" color="secondary">
              Zadejte novou cenu, která bude zaslána zákazníkovi.
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
        {currentPrice !== undefined && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <Text variant="label" color="secondary">
              Aktuální cena
            </Text>
            <Text variant="h4" color="textDark">
              {currentPrice.toLocaleString("cs-CZ")} Kč
            </Text>
          </div>
        )}
        <Input
          label="Nová cena (Kč)"
          inputProps={{
            type: "number",
            min: "0",
            step: "1",
            value: priceInput,
            onChange: (e) => setPriceInput(e.target.value),
            placeholder: "0",
          }}
        />
        {error && (
          <Text variant="body-sm" color="danger">
            {error}
          </Text>
        )}
        <Button
          text="Potvrdit změnu ceny"
          version="primary"
          loading={isProcessing}
          disabled={!isValidPrice || isProcessing}
          onClick={handleConfirm}
          className="w-full"
        />
      </div>
    </ModalLayout>
  );
}
