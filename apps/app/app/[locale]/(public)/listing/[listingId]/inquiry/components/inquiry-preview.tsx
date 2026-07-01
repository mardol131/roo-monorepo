"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { Event, Variant } from "@roo/common";
import { format } from "date-fns";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import {
  Banknote,
  Calendar,
  ListChecks,
  MapPin,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useListing, useListingDetail } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Control, Form, useWatch } from "react-hook-form";
import type { EventFormInputs } from "@/app/components/forms/events/new-event-form";
import { getIdFromRelationshipField } from "@roo/common";
import {
  calculateEstimatedPrice,
  durationMinutesFromServiceTime,
  pricingFactor,
  type PriceBreakdown,
} from "../utils/calculate-price";
import type {
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
  PricingUnits,
} from "@roo/common";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { useTranslations } from "next-intl";

type AnyDetail =
  | ListingVenueDetail
  | ListingGastroDetail
  | ListingEntertainmentDetail;

function PlaceholderRow({ text }: { text: string }) {
  return (
    <Text variant="label" color="secondary" className="italic">
      {text}
    </Text>
  );
}

function PreviewSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary-surface flex items-center justify-center shrink-0">
          {icon}
        </div>
        <Text variant="label-lg" color="textDark" className="font-semibold">
          {title}
        </Text>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-zinc-400">{icon}</span>
      <Text variant="label" color="secondary">
        {value}
      </Text>
    </div>
  );
}

type NormalizedEventPreview = {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  district: string | null;
  city: string | null;
  address: string | null;
  guests: {
    adults: number;
    children: number;
    ztp: boolean;
    pets: boolean;
  } | null;
};

function resolveRelationName(
  rel: string | { name: string } | null | undefined,
): string | null {
  if (!rel) return null;
  return typeof rel === "string" ? rel : rel.name;
}

function formatEventDateTime(date: Date): string {
  return format(date, "d. M. yyyy H:mm");
}

function normalizeEventData(eventData: Event): NormalizedEventPreview {
  return {
    name: eventData.name,
    startDate: eventData.date?.start ? new Date(eventData.date.start) : null,
    endDate: eventData.date?.end ? new Date(eventData.date.end) : null,
    district: resolveRelationName(eventData.location?.district),
    city: resolveRelationName(eventData.location?.city),
    address: eventData.location?.address ?? null,
    guests: eventData.guests
      ? {
          adults: eventData.guests.adults ?? 0,
          children: eventData.guests.children ?? 0,
          ztp: !!eventData.guests.ztp,
          pets: !!eventData.guests.pets,
        }
      : null,
  };
}

type DraftEventValues = {
  name?: string;
  startDate?: string;
  endDate?: string;
  locationDistrict?: { name?: string } | null;
  locationCity?: { name?: string } | null;
  locationAddress?: string;
  guests?: {
    adults?: number;
    children?: number;
    ztp?: boolean;
    pets?: boolean;
  };
};

function normalizeDraftValues(
  values: DraftEventValues,
): NormalizedEventPreview {
  return {
    name: values.name ?? "",
    startDate: values.startDate ? new Date(values.startDate) : null,
    endDate: values.endDate ? new Date(values.endDate) : null,
    district: values.locationDistrict?.name ?? null,
    city: values.locationCity?.name ?? null,
    address: values.locationAddress ?? null,
    guests: values.guests
      ? {
          adults: values.guests.adults ?? 0,
          children: values.guests.children ?? 0,
          ztp: !!values.guests.ztp,
          pets: !!values.guests.pets,
        }
      : null,
  };
}

function EventPreviewRows({ data }: { data: NormalizedEventPreview }) {
  const locationLabel = [data.district, data.city, data.address]
    .filter(Boolean)
    .join(", ");
  const guests = data.guests;
  const hasGuests =
    !!guests &&
    (guests.adults > 0 || guests.children > 0 || guests.ztp || guests.pets);

  return (
    <div className="flex flex-col gap-2">
      <Text variant="label-lg" color="textDark" className="font-semibold">
        {data.name}
      </Text>
      <div className="flex flex-col gap-1.5">
        {data.startDate && (
          <InfoRow
            icon={<Calendar className="w-3.5 h-3.5" />}
            value={`${formatEventDateTime(data.startDate)}${
              data.endDate &&
              data.endDate.getTime() !== data.startDate.getTime()
                ? ` – ${formatEventDateTime(data.endDate)}`
                : ""
            }`}
          />
        )}
        {locationLabel && (
          <InfoRow
            icon={<MapPin className="w-3.5 h-3.5" />}
            value={locationLabel}
          />
        )}
        {hasGuests && (
          <InfoRow
            icon={<Users className="w-3.5 h-3.5" />}
            value={[
              guests!.adults > 0 && `${guests!.adults} dospělých`,
              guests!.children > 0 && `${guests!.children} dětí`,
              guests!.ztp && "ZTP",
              guests!.pets && "mazlíčci",
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}
      </div>
    </div>
  );
}

function EventPreview({ eventData }: { eventData: Event }) {
  return <EventPreviewRows data={normalizeEventData(eventData)} />;
}

function DraftEventPreview({ control }: { control: Control<EventFormInputs> }) {
  const values = useWatch({ control });

  if (!values.name) {
    return <PlaceholderRow text="Vyplňte základní údaje události" />;
  }

  return <EventPreviewRows data={normalizeDraftValues(values)} />;
}

const PRICING_UNIT_LABELS: Record<string, string> = {
  per_day: "/ den",
  per_person: "/ os.",
  per_hour: "/ hod.",
  lump_sum: "",
};

function VariantPreview({ variant }: { variant: Variant }) {
  const { eventData, serviceTime } = useOrderStore();
  const unitPrice = variant.price.base;
  const coverFilename = variant.images?.coverImage?.filename;

  const startMs = eventData?.date?.start
    ? new Date(eventData.date.start).getTime()
    : 0;
  const endMs = eventData?.date?.end
    ? new Date(eventData.date.end).getTime()
    : startMs;
  const days = Math.max(1, Math.ceil((endMs - startMs) / 86_400_000));
  const adults = eventData?.guests?.adults ?? 1;
  const durationMinutes = durationMinutesFromServiceTime(serviceTime);

  const total =
    unitPrice *
    pricingFactor(variant.price.pricingUnit, days, adults, durationMinutes);
  const hasEvent = !!eventData?.date?.start;
  const totalAboveUnit = hasEvent && total > unitPrice;

  const unitLabel = PRICING_UNIT_LABELS[variant.price.pricingUnit] ?? "";

  return (
    <div className="flex flex-col gap-3">
      {coverFilename && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-zinc-100">
          <Image
            src={generateMediaUrl(coverFilename)}
            alt={variant.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <Text variant="label-lg" color="textDark" className="font-semibold">
        {variant.name}
      </Text>
      <div className="flex flex-col gap-1">
        <div className={totalAboveUnit ? "opacity-40" : undefined}>
          <InfoRow
            icon={<Banknote className="w-3.5 h-3.5" />}
            value={`${unitPrice.toLocaleString("cs-CZ")} Kč${unitLabel ? ` ${unitLabel}` : ""}`}
          />
        </div>
        {totalAboveUnit && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 mt-1">
            <Text variant="label" color="textDark" className="font-semibold">
              Orientační cena
            </Text>
            <Text variant="label-lg" color="primary" className="font-bold">
              {total.toLocaleString("cs-CZ")} Kč
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Price breakdown ───────────────────────────────────────────────────────────

function PriceBreakdownRow({
  label,
  amount,
  pricingUnit,
  quantity,
}: {
  label: string;
  amount: number;
  pricingUnit?: PricingUnits;
  quantity?: number;
}) {
  const t = useTranslations("global.pricing.units");
  if (amount === 0) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <Text variant="label" color="secondary">
        {label} {quantity && `×${quantity}`}
      </Text>
      <Text variant="label" color="secondary">
        {amount.toLocaleString("cs-CZ")} Kč
        {pricingUnit ? ` / ${t(pricingUnit)}` : ""}
      </Text>
    </div>
  );
}

function CustomRequestPreview({
  detail,
  minimumPrice,
  listingLocation,
}: {
  detail: AnyDetail | undefined;
  minimumPrice?: number;
  listingLocation?: [number, number];
}) {
  const {
    customRequest,
    selectedAddons,
    selectedSpaces,
    accommodation,
    breakfast,
    parking,
    wantsCatering,
    eventData,
    serviceTime,
  } = useOrderStore();

  const breakdown: PriceBreakdown = calculateEstimatedPrice({
    detail,
    eventData,
    selectedAddons,
    selectedSpaces,
    accommodation,
    breakfast,
    parking,
    wantsCatering,
    serviceTime,
    listingLocation,
  });

  const hasSelections =
    selectedAddons.length > 0 ||
    selectedSpaces.length > 0 ||
    !!accommodation ||
    !!breakfast ||
    !!parking ||
    wantsCatering;

  if (!customRequest?.note && !hasSelections) {
    return <PlaceholderRow text="Poptávka se vyplňuje…" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {customRequest?.note && (
        <div className="flex items-start gap-2">
          <MessageCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <Text variant="label" color="secondary" className="line-clamp-3">
            {customRequest.note}
          </Text>
        </div>
      )}

      {customRequest?.requirements && customRequest.requirements.length > 0 && (
        <div className="flex items-start gap-2">
          <ListChecks className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <ul className="flex flex-col gap-0.5">
            {customRequest.requirements.map((requirement, index) => (
              <li key={index}>
                <Text variant="label" color="secondary">
                  {requirement.text}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedSpaces.length > 0 && (
        <div className="flex flex-col gap-1">
          {selectedSpaces.map((s) => (
            <PriceBreakdownRow
              key={s.name}
              label={s.name}
              amount={s.price}
              pricingUnit={s.pricingUnit}
            />
          ))}
        </div>
      )}

      {selectedAddons.length > 0 && (
        <div className="flex flex-col gap-1">
          {selectedAddons.map((a) => (
            <PriceBreakdownRow
              key={a.name + a.optionId}
              label={a.name}
              amount={a.unitPrice * a.quantity}
              quantity={a.quantity}
              pricingUnit={a.pricingUnit}
            />
          ))}
        </div>
      )}

      {/* Price breakdown */}
      {breakdown.total > 0 && (
        <div className="border-t border-zinc-100 pt-3 flex flex-col gap-1.5">
          <PriceBreakdownRow label="Základ" amount={breakdown.base} />
          <PriceBreakdownRow label="Prostory" amount={breakdown.spaces} />
          <PriceBreakdownRow label="Doplňky" amount={breakdown.addons} />
          <PriceBreakdownRow label="Snídaně" amount={breakdown.breakfast} />
          <PriceBreakdownRow label="Parkování" amount={breakdown.parking} />
          <PriceBreakdownRow label="Catering" amount={breakdown.catering} />
          {breakdown.travelFeeEstimate > 0 && (
            <PriceBreakdownRow
              label="Cestovné (odhad)"
              amount={breakdown.travelFeeEstimate}
            />
          )}
          {minimumPrice !== undefined && minimumPrice > 0 && (
            <div
              className={`flex items-center justify-between gap-2 ${breakdown.total > minimumPrice ? "opacity-40" : ""}`}
            >
              <Text variant="caption" color="secondary">
                Minimální cena
              </Text>
              <Text variant="caption" color="secondary">
                {minimumPrice.toLocaleString("cs-CZ")} Kč
              </Text>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-200 mt-1">
            <Text variant="label" color="textDark" className="font-semibold">
              Orientační cena
            </Text>
            <Text variant="label-lg" color="primary" className="font-bold">
              {breakdown.total.toLocaleString("cs-CZ")} Kč
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function InquiryPreview({
  newEventControl,
}: {
  newEventControl?: Control<EventFormInputs>;
}) {
  const { eventData, inquiryMode, currentVariantId } = useOrderStore();
  const params = useParams<{ listingId: string }>();
  const { data: variants } = useVariantsByListing(params.listingId);
  const { data: listing } = useListing(params.listingId);
  const selectedVariant = variants?.docs?.find(
    (v) => v.id === currentVariantId,
  );

  const detailId = listing
    ? getIdFromRelationshipField(listing.detail.value)
    : undefined;
  const { data: detail } = useListingDetail(
    listing
      ? `listing-${listing.type}-details`
      : "listing-entertainment-details",
    detailId,
  );

  return (
    <div className="flex flex-col gap-4">
      <FormSection icon={"Calendar"} title="Událost">
        {newEventControl ? (
          <DraftEventPreview control={newEventControl} />
        ) : eventData ? (
          <EventPreview eventData={eventData} />
        ) : (
          <PlaceholderRow text="Zatím nevybrána událost" />
        )}
      </FormSection>

      <FormSection icon={"Send"} title="Nabídka">
        {inquiryMode === "variant" && selectedVariant ? (
          <VariantPreview variant={selectedVariant} />
        ) : inquiryMode === "custom" ? (
          <CustomRequestPreview
            detail={detail as AnyDetail | undefined}
            minimumPrice={listing?.minimumPricePerEvent ?? undefined}
            listingLocation={
              listing?.location?.point as [number, number] | undefined
            }
          />
        ) : (
          <PlaceholderRow text="Zatím nevybrána nabídka" />
        )}
      </FormSection>
    </div>
  );
}
