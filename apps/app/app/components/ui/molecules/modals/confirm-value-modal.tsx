"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  header: string;
  description?: string;
  valueLabel: string;
  valuePlaceholder?: string;
  valueType?: React.HTMLInputTypeAttribute;
  confirmLabel: string;
  confirmPlaceholder?: string;
  submitLabel?: string;
  isLoading?: boolean;
  errorMessage?: string;
  validate?: (value: string) => string | undefined;
};

export function ConfirmValueModal({
  isOpen,
  onClose,
  onSubmit,
  header,
  description,
  valueLabel,
  valuePlaceholder,
  valueType = "text",
  confirmLabel,
  confirmPlaceholder,
  submitLabel = "Uložit",
  isLoading,
  errorMessage,
  validate,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ value: string; confirm: string }>();

  const value = watch("value");

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <ModalLayout
      header={header}
      isOpen={isOpen}
      onClose={handleClose}
      errorMessage={errorMessage}
      maxWidth="max-w-md"
    >
      <form
        onSubmit={handleSubmit((data) => onSubmit(data.value))}
        className="flex flex-col gap-4"
      >
        {description && <p className="text-sm text-zinc-500">{description}</p>}
        <Input
          label={valueLabel}
          isRequired
          inputProps={{
            ...register("value", { required: "Pole je povinné", validate }),
            type: valueType,
            placeholder: valuePlaceholder,
          }}
          error={errors.value?.message}
        />
        <Input
          label={confirmLabel}
          isRequired
          inputProps={{
            ...register("confirm", {
              required: "Pole je povinné",
              validate: (v) => v === value || "Hodnoty se neshodují",
            }),
            type: valueType,
            placeholder: confirmPlaceholder,
          }}
          error={errors.confirm?.message}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            version="plain"
            onClick={handleClose}
          />
          <Button
            htmlType="submit"
            text={submitLabel}
            version="primary"
            loading={isLoading}
          />
        </div>
      </form>
    </ModalLayout>
  );
}
