"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Text from "../../atoms/text";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  header: string;
  description?: string;
  inputLabel: string;
  inputType?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  submitLabel?: string;
  isLoading?: boolean;
  errorMessage?: string;
  successMessage?: React.ReactNode | string;
  successHeader?: string;
};

export function SingleInputModal({
  isOpen,
  onClose,
  onSubmit,
  header,
  description,
  inputLabel,
  inputType = "text",
  placeholder,
  submitLabel = "Odeslat",
  isLoading,
  errorMessage,
  successMessage,
  successHeader,
}: Props) {
  const [succeeded, setSucceeded] = useState(false);

  const schema = z.object({
    value: z
      .string(errorMessage)
      .min(1, errorMessage || "Musíte vyplnit toto pole"),
  });

  type FormInput = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  function handleClose() {
    reset();
    setSucceeded(false);
    onClose();
  }

  function handleSubmitWrapper(value: string) {
    onSubmit(value);
    if (successMessage) setSucceeded(true);
  }

  return (
    <ModalLayout
      header={succeeded && successHeader ? successHeader : header}
      isOpen={isOpen}
      onClose={handleClose}
      errorMessage={!succeeded ? errorMessage : undefined}
      maxWidth="max-w-md"
    >
      {succeeded && successMessage ? (
        <div className="flex flex-col gap-4">
          {typeof successMessage === "string" ? (
            <Text variant="label-lg">{successMessage}</Text>
          ) : (
            successMessage
          )}
          <div className="flex justify-end">
            <Button
              htmlType="button"
              text="Zavřít"
              version="primary"
              onClick={handleClose}
            />
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((data) => handleSubmitWrapper(data.value))}
          className="flex flex-col gap-4"
        >
          {description && <Text variant="label-lg">{description}</Text>}
          <Input
            label={inputLabel}
            isRequired
            inputProps={{ ...register("value"), type: inputType, placeholder }}
            error={errors.value?.message}
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
      )}
    </ModalLayout>
  );
}
