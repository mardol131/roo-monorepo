"use client";

import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import Text from "@/app/components/ui/atoms/text";
import { useRouter } from "@/app/i18n/navigation";
import { useVariant } from "@/app/react-query/variants/hooks";
import { Variant } from "@roo/common";
import { Banknote, Check, Package, X } from "lucide-react";
import { useParams } from "next/navigation";
import { GastroDetails } from "./components/gastro-details";
import Loader from "@/app/[locale]/(user)/components/loader";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { ItemListCard } from "@/app/[locale]/(user)/components/item-list-card";
import { VenueDetails } from "./components/venue-details";
import { EntertainmentDetails } from "./components/entertainment-details";

const TYPE_LABELS: Record<Variant["type"], string> = {
  allYear: "Celoroční",
  seasonal: "Sezónní",
};

export default function Page() {
  const { variantId } = useParams<{
    companyId: string;
    listingId: string;
    variantId: string;
  }>();
  const { data: variant, isPending } = useVariant(variantId);
  const router = useRouter();
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
    variantId: string;
  }>();

  if (isPending) return <Loader text="Načítám variantu..." />;
  if (!variant) return router.back();

  const firstBlock = variant.details[0];
  const capacityText = firstBlock
    ? firstBlock.capacity.min
      ? `${firstBlock.capacity.min}–${firstBlock.capacity.max} osob`
      : `max. ${firstBlock.capacity.max} osob`
    : null;

  const availabilityText =
    variant.availability === "allDay"
      ? "Celý den"
      : (variant.selectedHours?.map((h) => `${h.from}–${h.to}`).join(", ") ??
        "Vybrané hodiny");

  const eventTypeNames = variant.eventTypes
    ?.map((et) => (typeof et === "string" ? et : et.name))
    .join(", ");

  const infoItems = [
    { icon: "Banknote", text: `${variant.price.generalPrice} Kč` },
    { icon: "CalendarClock", text: TYPE_LABELS[variant.type] },
    { icon: "Clock", text: availabilityText },
    ...(capacityText ? [{ icon: "Users", text: capacityText }] : []),
    ...(eventTypeNames ? [{ icon: "Tag", text: eventTypeNames }] : []),
  ];

  return (
    <main className="w-full">
      <Breadcrumbs />
      <DashboardHeader
        icon={Package}
        iconBg="bg-variant-surface"
        iconColor="text-variant"
        name={variant.name}
        infoItems={infoItems}
        button={{
          text: "Upravit",
          size: "sm",
          version: "variantFull",
          iconLeft: "Pencil",
          link: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/edit",
            params: {
              companyId: companyId,
              listingId: listingId,
              variantId: variantId,
            },
          },
        }}
      />

      <div className="flex flex-col gap-4">
        {/* Description */}
        {(variant.shortDescription || variant.description) && (
          <DashboardSection
            title="Popis varianty"
            icon={Package}
            iconBg="bg-variant-surface"
            iconColor="text-variant"
          >
            <Text variant="body-sm" color="textDark">
              {variant.shortDescription}
            </Text>
            {variant.description && (
              <Text variant="body" color="textDark" className="mt-2">
                {variant.description}
              </Text>
            )}
          </DashboardSection>
        )}
        {/* Includes / Excludes */}
        {(variant.includes || variant.excludes) && (
          <div className="grid grid-cols-2 gap-4">
            {variant.includes ? (
              <ItemListCard
                heading="V ceně zahrnuto"
                items={variant.includes.flatMap((inc) => inc.item ?? [])}
                icon={Check}
                iconColor="text-emerald-500"
                iconBgColor="bg-emerald-50"
              />
            ) : null}
            {variant.excludes ? (
              <ItemListCard
                heading="Není zahrnuto"
                items={variant.excludes.flatMap((exc) => exc.item ?? [])}
                icon={X}
                iconColor="text-red-400"
                iconBgColor="bg-red-50"
              />
            ) : null}
          </div>
        )}
        {/* Seasonal prices */}
        {variant.price.seasonalPrices?.length ? (
          <DashboardSection
            title="Sezónní ceny"
            icon={Banknote}
            iconBg="bg-amber-100"
            iconColor="text-amber-500"
          >
            <div className="flex flex-col">
              {variant.price.seasonalPrices.map((sp) => (
                <div
                  key={sp.id}
                  className="py-2.5 flex items-center justify-between border-b border-zinc-100 last:border-0"
                >
                  <div>
                    {sp.description && (
                      <Text variant="label-lg" color="textDark">
                        {sp.description}
                      </Text>
                    )}
                    <Text variant="body-sm" color="textLight">
                      {sp.from} – {sp.to}
                    </Text>
                  </div>
                  <Text variant="label-lg" color="textDark">
                    {sp.price} Kč
                  </Text>
                </div>
              ))}
            </div>
          </DashboardSection>
        ) : null}
        {/* Detail blocks */}
        <div className="flex flex-col gap-4">
          {variant.details.map((block, i) => {
            if (block.blockType === "venue")
              return <VenueDetails key={i} block={block} />;
            if (block.blockType === "gastro")
              return <GastroDetails key={i} block={block} />;
            if (block.blockType === "entertainment")
              return <EntertainmentDetails key={i} block={block} />;
            return null;
          })}
        </div>
      </div>
    </main>
  );
}
