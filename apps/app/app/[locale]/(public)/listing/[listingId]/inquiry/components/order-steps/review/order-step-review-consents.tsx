"use client";

import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import Text from "@/app/components/ui/atoms/text";
import { Banknote, Handshake, MessageCircle, Send } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import * as yup from "yup";

export const consentSchema = yup.object({
  terms: yup
    .boolean()
    .oneOf([true], "Souhlas s obchodními podmínkami je povinný")
    .required(),
  gdprAndSharing: yup
    .boolean()
    .oneOf([true], "Souhlas se zpracováním osobních údajů je povinný")
    .required(),
  marketing: yup.boolean().required().default(false),
});

export type ConsentInputs = yup.InferType<typeof consentSchema>;

interface Props {
  control: Control<ConsentInputs>;
  errors: FieldErrors<ConsentInputs>;
}

export default function OrderStepReviewConsents({ control, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <Text variant="h4" color="textDark" className="font-semibold mb-1">
          Shrnutí a souhlas
        </Text>
        <Text variant="label" color="secondary">
          Zkontrolujte poptávku vpravo a potvrďte souhlasy pro odeslání.
        </Text>
      </div>

      {/* Consents */}
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div ref={field.ref}>
              <Checkbox
                error={errors.terms?.message}
                checked={field.value ?? false}
                onChange={field.onChange}
                label={
                  <span>
                    Souhlasím s{" "}
                    <a
                      href="/obchodni-podminky"
                      target="_blank"
                      className="underline hover:text-zinc-900 transition-colors"
                    >
                      obchodními podmínkami
                    </a>
                  </span>
                }
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="gdprAndSharing"
          render={({ field }) => (
            <div ref={field.ref}>
              <Checkbox
                error={errors.gdprAndSharing?.message}
                checked={field.value ?? false}
                onChange={field.onChange}
                label={
                  <span>
                    Souhlasím se{" "}
                    <a
                      href="/gdpr"
                      target="_blank"
                      className="underline hover:text-zinc-900 transition-colors"
                    >
                      zpracováním osobních údajů (GDPR)
                    </a>{" "}
                    a jejich sdílením s dodavatelem
                  </span>
                }
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="marketing"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Souhlasím se zasíláním marketingových sdělení (nepovinné)"
            />
          )}
        />
      </div>

      {/* What happens next */}
      <div className="rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200">
          <Text variant="h4" color="textDark">
            Co se stane po odeslání?
          </Text>
        </div>
        <div className="divide-y divide-zinc-100">
          <NextStep
            icon={Send}
            title="Poptávka bude odeslána dodavateli"
            description="Dodavatel obdrží vaši poptávku včetně detailů o eventu a zvolené variantě."
          />
          <NextStep
            icon={MessageCircle}
            title="Domluvení detailů"
            description="Dodavatel vás v chatu kontaktuje, případně rovnou potvrdí či odmítne poptávku."
          />
          <NextStep
            icon={Handshake}
            title="Potvrzení rezervace"
            description="Jakmile bude vše domluveno a dodavatel vše potvrdí, bude finální rozhodnutí na vás. Poptávka není závazná, dokud ji nepotvrdíte."
          />
          <NextStep
            icon={Banknote}
            title="Platba a event"
            description="Platbu a zbylé detaily domluvíte přímo s dodavatelem. Po skončení eventu můžete zanechat recenzi."
          />
        </div>
      </div>

      <Text variant="caption" color="secondary">
        Odesláním poptávky nevzniká závazek — dodavatel vám musí nejprve odpovědět a
        potvrdit dostupnost. Následně musí přijít finální potvrzení od vás.
      </Text>
    </div>
  );
}

function NextStep({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-zinc-500" />
      </div>
      <div className="flex flex-col gap-0.5">
        <Text variant="label-lg" color="textDark" className="font-semibold">
          {title}
        </Text>
        <Text variant="label" color="secondary">
          {description}
        </Text>
      </div>
    </div>
  );
}
