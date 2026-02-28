"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import {
  Calendar,
  MapPin,
  Users,
  PawPrint,
  Send,
  MessageCircle,
  Handshake,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import OfferItem from "../../../../components/offer-item";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import StepHeading from "../step-heading";
import Button from "@/app/components/ui/atoms/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  terms: yup
    .boolean()
    .oneOf([true], "Souhlas s obchodními podmínkami je povinný")
    .required(),
  gdpr: yup
    .boolean()
    .oneOf([true], "Souhlas se zpracováním osobních údajů je povinný")
    .required(),
});

type SubmitData = yup.InferType<typeof schema>;

export default function OrderStepReviewVariant() {
  const { currentOfferIndex, offers, eventData } = useOrderStore();

  const offer =
    currentOfferIndex !== undefined ? offers[currentOfferIndex] : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitData>({
    defaultValues: {
      terms: false,
      gdpr: false,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: SubmitData) => {
    const orderSummary = {
      event: eventData,
      offer: offer,
      legal: {
        terms: data.terms,
        gdpr: data.gdpr,
      },
    };

    console.log("Order Summary:", orderSummary);
    // Here you would typically send the data to your backend or perform other actions
  };

  return (
    <div>
      <StepHeading
        title="Shrnutí poptávky"
        description="Zkontrolujte vaší poptávku"
      />
      <div className="flex flex-col gap-6">
        {/* Event Summary Card */}

        {eventData?.name && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col gap-4">
            <Text variant="label1" color="dark" className="font-semibold">
              Informace o eventu
            </Text>
            <div className="grid grid-cols-2 gap-3">
              <EventInfoRow
                icon={<Calendar className="w-4 h-4 text-zinc-500" />}
                label="Název eventu"
                value={eventData.name}
              />
              {eventData.date?.start && (
                <EventInfoRow
                  icon={<Calendar className="w-4 h-4 text-zinc-500" />}
                  label="Datum"
                  value={`${eventData.date.start.toLocaleDateString("cs-CZ")}${
                    eventData.date.end &&
                    eventData.date.end.getTime() !==
                      eventData.date.start.getTime()
                      ? ` – ${eventData.date.end.toLocaleDateString("cs-CZ")}`
                      : ""
                  }`}
                />
              )}
              {eventData.location?.name && (
                <EventInfoRow
                  icon={<MapPin className="w-4 h-4 text-zinc-500" />}
                  label="Místo"
                  value={eventData.location.name}
                />
              )}
              {eventData?.guests && (
                <EventInfoRow
                  icon={<Users className="w-4 h-4 text-zinc-500" />}
                  label="Počet osob"
                  value={[
                    eventData.guests.adults > 0 &&
                      `${eventData.guests.adults} dospělí`,
                    eventData.guests.children > 0 &&
                      `${eventData.guests.children} děti`,
                    eventData.guests.ztp && `${eventData.guests.ztp} ZTP`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              )}
              {eventData.guests?.pets && (
                <EventInfoRow
                  icon={<PawPrint className="w-4 h-4 text-zinc-500" />}
                  label="Domácí mazlíčci"
                  value="Ano"
                />
              )}
            </div>
          </div>
        )}

        {/* Selected Offer Card */}
        {offer && (
          <OfferItem
            variant="review"
            offer={offer}
            onOrderButtonClick={handleSubmit(() => {})}
            orderButtonText="Odeslat poptávku"
          />
        )}

        {/* Consent Checkboxes */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5"
        >
          <div className="flex flex-col gap-4 border border-zinc-200 rounded-2xl p-5">
            <Text variant="label1" color="dark" className="font-semibold">
              Souhlas s podmínkami
            </Text>
            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="terms"
                render={({ field }) => (
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
                )}
              />

              <Controller
                control={control}
                name="gdpr"
                render={({ field }) => (
                  <Checkbox
                    error={errors.gdpr?.message}
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
                )}
              />
            </div>
          </div>

          {/* What happens next */}
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200">
              <Text variant="heading5" color="dark">
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
                title="Dodavatel vás do 48 hodin kontaktuje"
                description="Odpovíme vám s potvrzením dostupnosti, případně doplňujícími dotazy."
              />
              <NextStep
                icon={Handshake}
                title="Domluvíte detaily a uzavřete spolupráci"
                description="Po odsouhlasení podmínek obdržíte smlouvu a potvrzení rezervace."
              />
            </div>
            <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-6">
              <Text variant="label4" color="secondary">
                Odesláním poptávky nevzniká závazek — dodavatel vás nejprve
                kontaktuje s nabídkou.
              </Text>
              <Button
                text="Odeslat poptávku"
                version="primary"
                iconRight="ArrowRight"
                htmlType="submit"
              />
            </div>
          </div>
        </form>
      </div>
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
        <Text variant="label1" color="dark" className="font-semibold">
          {title}
        </Text>
        <Text variant="label3" color="secondary">
          {description}
        </Text>
      </div>
    </div>
  );
}

function EventInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex flex-col">
        <Text variant="label4" color="secondary">
          {label}
        </Text>
        <Text variant="label2" color="dark" className="font-medium">
          {value}
        </Text>
      </div>
    </div>
  );
}
