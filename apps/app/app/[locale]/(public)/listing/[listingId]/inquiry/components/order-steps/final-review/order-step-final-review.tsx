"use client";

import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { Event } from "@roo/common";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  Calendar,
  Handshake,
  MapPin,
  MessageCircle,
  PawPrint,
  Send,
  Users,
} from "lucide-react";
import { useCreateInquiry } from "@/app/react-query/inquiries/hooks";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import FormVariantSummary from "./form-variant-summary";
import StepHeading from "../step-heading";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";

function getLocationLabel(location: Event["location"]): string | null {
  if (!location) return null;
  if (location.type === "venue") {
    if (!location.venue) return "Zatím neurčeno";
    return typeof location.venue === "string"
      ? location.venue
      : location.venue.name;
  }
  const cityName = location.city
    ? typeof location.city === "string"
      ? location.city
      : location.city.name
    : null;
  const parts = [cityName, location.address].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Zatím neurčeno";
}

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

export default function OrderStepFinalReview({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { listingId } = useParams<{ listingId: string }>();
  const {
    currentVariantId,
    eventData,
    inquiryMode,
    customRequest,
    resetIndices,
  } = useOrderStore();
  const { mutate: createInquiry } = useCreateInquiry();
  const { data: variants } = useVariantsByListing(listingId);

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

  const onSubmit = (_data: SubmitData) => {
    if (!eventData) return;

    const isCustom = inquiryMode === "custom";
    if (!isCustom && !currentVariantId) return;

    let price = null;
    if (!isCustom) {
      const selectedVariant = variants?.docs?.find(
        (v) => v.id === currentVariantId,
      );

      const currentDate = new Date();
      const seasonalPricing = selectedVariant?.price.seasonalPrices?.find(
        (sp) => {
          if (!sp.from || !sp.to) return false;
          const startDate = new Date(sp.from);
          const endDate = new Date(sp.to);
          return currentDate >= startDate && currentDate <= endDate;
        },
      );
      price =
        seasonalPricing?.price ?? selectedVariant?.price.generalPrice ?? null;
    }

    createInquiry(
      {
        listing: listingId,
        ...(isCustom ? {} : { variant: currentVariantId }),
        event: typeof eventData.id === "string" ? eventData.id : eventData.id,
        listingType: "venue",
        request: isCustom
          ? {
              note: customRequest?.note,
              requirements: customRequest?.requirements,
            }
          : { note: "" },
        status: {
          company: "pending",
          user: "pending",
          listing: "active",
          variant: "active",
        },
        pricing: { mode: "open", quotedPrice: price, agreedPrice: null },
        activity: {},
        user: "",
        snapshots: {},
      },
      {
        onSuccess: () => {
          resetIndices();
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const selectedVariant = variants?.docs?.find(
    (v) => v.id === currentVariantId,
  );

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
            <Text variant="label-lg" color="textDark" className="font-semibold">
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
                  value={`${format(new Date(eventData.date.start), "d. M. yyyy")}${
                    eventData.date.end &&
                    eventData.date.end !== eventData.date.start
                      ? ` – ${format(new Date(eventData.date.end), "d. M. yyyy")}`
                      : ""
                  }`}
                />
              )}
              {(() => {
                const loc = getLocationLabel(eventData.location);
                return loc ? (
                  <EventInfoRow
                    icon={<MapPin className="w-4 h-4 text-zinc-500" />}
                    label="Místo"
                    value={loc}
                  />
                ) : null;
              })()}
              {eventData?.guests && (
                <EventInfoRow
                  icon={<Users className="w-4 h-4 text-zinc-500" />}
                  label="Počet osob"
                  value={[
                    eventData.guests.adults > 0 &&
                      `${eventData.guests.adults} dospělí`,
                    eventData.guests.children > 0 &&
                      `${eventData.guests.children} děti`,
                    eventData.guests.ztp && "ZTP",
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

        {/* Selected variant / custom request summary */}
        {inquiryMode === "custom" && customRequest ? (
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col gap-4">
            <Text variant="label-lg" color="textDark" className="font-semibold">
              Vlastní poptávka
            </Text>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                <Text variant="caption" color="secondary">
                  Popis poptávky
                </Text>
              </div>
              <Text
                variant="label"
                color="textDark"
                className="whitespace-pre-wrap pl-6"
              >
                {customRequest.note}
              </Text>
            </div>
            {customRequest.requirements.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-zinc-400 shrink-0" />
                  <Text variant="caption" color="secondary">
                    Konkrétní požadavky
                  </Text>
                </div>
                <ul className="flex flex-col gap-1.5 pl-6">
                  {customRequest.requirements.map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                      <Text variant="label" color="textDark">
                        {r.text}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          selectedVariant && <FormVariantSummary variant={selectedVariant} />
        )}

        {/* Consent Checkboxes */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5"
        >
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200">
              <Text variant="h4" color="textDark">
                Co se stane po odeslání?
              </Text>
            </div>
            <div className="flex px-5 py-4 flex-col gap-3">
              <Controller
                control={control}
                name="terms"
                render={({ field }) => (
                  <div ref={field.ref}>
                    {" "}
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
                name="gdpr"
                render={({ field }) => (
                  <div ref={field.ref}>
                    {" "}
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
                  </div>
                )}
              />
            </div>
            <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-6">
              <Text variant="caption" color="secondary">
                Odesláním poptávky nevzniká závazek — dodavatel vás nejprve
                kontaktuje s nabídkou.
              </Text>
              <Button
                className="shrink-0"
                text="Odeslat poptávku"
                version="primary"
                iconRight="ArrowRight"
                htmlType="submit"
              />
            </div>
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
                title="Dodavatel vás do 48 hodin kontaktuje"
                description="Odpovíme vám s potvrzením dostupnosti, případně doplňujícími dotazy."
              />
              <NextStep
                icon={Handshake}
                title="Domluvíte detaily a uzavřete spolupráci"
                description="Po odsouhlasení podmínek obdržíte smlouvu a potvrzení rezervace."
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
        <Text variant="caption" color="secondary">
          {label}
        </Text>
        <Text variant="label" color="textDark" className="font-medium">
          {value}
        </Text>
      </div>
    </div>
  );
}
