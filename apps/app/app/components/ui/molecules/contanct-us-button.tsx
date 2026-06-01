"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { useClickOutside } from "@/app/hooks/use-click-outside";

type FormState = {
  name: string;
  email: string;
  message: string;
};

export default function ContactUsButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormState>();

  function onSubmit(data: FormState) {
    console.log("Contact form submitted:", data);
    setSubmitted(true);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 300);
  }

  const messageWindowRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(messageWindowRef, () => {
    if (open) {
      handleClose();
    }
  });

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          ref={messageWindowRef}
          className="w-80 rounded-2xl bg-white shadow-xl border border-zinc-200 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <Text variant="h4">Kontaktujte nás</Text>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4">
            {submitted ? (
              <div className="py-6 text-center flex flex-col gap-2">
                <Text variant="h3">Děkujeme!</Text>
                <Text variant="body-sm" color="textLight">
                  Vaši zprávu jsme přijali a brzy se ozveme.
                </Text>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <Input
                  label="Jméno"
                  isRequired
                  error={errors.name?.message}
                  inputProps={{
                    ...register("name", { required: "Zadejte jméno" }),
                  }}
                />
                <Input
                  label="E-mail"
                  isRequired
                  error={errors.email?.message}
                  inputProps={{
                    type: "email",
                    ...register("email", {
                      required: "Zadejte e-mail",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Neplatný formát e-mailu",
                      },
                    }),
                  }}
                />
                <Textarea
                  label="Zpráva"
                  maxLength={500}
                  error={errors.message?.message}
                  inputProps={{
                    rows: 4,
                    ...register("message", { required: "Napište zprávu" }),
                  }}
                />
                <Button
                  text="Odeslat zprávu"
                  version="primary"
                  htmlType="submit"
                  className="w-full mt-1"
                />
              </form>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
        aria-label="Kontaktujte nás"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
