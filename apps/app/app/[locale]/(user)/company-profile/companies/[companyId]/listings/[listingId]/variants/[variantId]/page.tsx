"use client";

import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { ItemListCard } from "@/app/[locale]/(user)/components/item-list-card";
import Loader from "@/app/[locale]/(user)/components/loader";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import { VariantEntertainmentDetails } from "@/app/[locale]/(user)/components/variant-entertainment-details";
import { VariantGastroDetails } from "@/app/[locale]/(user)/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/components/variant-gastro-details";
import { VariantVenueDetails } from "@/app/[locale]/(user)/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/components/variant-venue-details";
import Text from "@/app/components/ui/atoms/text";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { useRouter } from "@/app/i18n/navigation";
import { useUpdateVariant, useVariant } from "@/app/react-query/variants/hooks";
import { format } from "date-fns";
import { Package, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { ControlSection } from "../../../../../../../components/control-section";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { CompletionWidget } from "@/app/[locale]/(user)/components/completion-widget";
import { getFullVariantCompletion } from "@/app/functions/utils/variants";

export default function Page() {
  const { companyId, listingId, variantId } = useParams<{
    companyId: string;
    listingId: string;
    variantId: string;
  }>();
  const { data: variant, isPending } = useVariant(variantId);
  const { data: spaces } = useSpacesByListing(listingId);
  const { mutate: updateVariant, isPending: isUpdating } = useUpdateVariant();
  const router = useRouter();

  if (isPending) return <Loader text="Načítám variantu..." />;
  if (!variant) return router.back();

  const isActive = variant.status === "active";

  const handleToggleStatus = () => {
    updateVariant({
      id: variantId,
      data: { status: isActive ? "inactive" : "active" },
    });
  };

  const handleDelete = () => {
    updateVariant(
      {
        id: variantId,
        data: { status: "archived" },
      },
      {
        onSuccess: () => {
          router.push({
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/variants",
            params: { companyId, listingId },
          });
        },
      },
    );
  };

  const capacityText = variant.capacity.min
    ? `${variant.capacity.min}–${variant.capacity.max} osob`
    : `max. ${variant.capacity.max} osob`;

  const infoItems = [
    { icon: "Banknote", text: `${variant.price.base} Kč` },
    { icon: "Users", text: capacityText },
  ];

  const basicInfoItems = [
    ...(variant.shortDescription
      ? [
          {
            type: "text" as const,
            label: "Krátký popis",
            value: variant.shortDescription,
          },
        ]
      : []),
    ...(variant.description
      ? [
          {
            type: "text" as const,
            label: "Popis",
            value: variant.description,
          },
        ]
      : []),
  ];

  return (
    <main className="w-full">
      <Breadcrumbs />
      <DashboardHeader
        icon={Package}
        iconBg="bg-variant-surface"
        iconColor="text-variant"
        name={variant.name}
        nameSideComponent={<ListingStatusTag status={variant.status} />}
        infoItems={infoItems}
        buttons={[
          {
            text: "Odkaz",
            size: "sm",
            version: "plain",
            iconLeft: "Link",
            linkTarget: "_blank",
            link: {
              pathname: "/listing/[listingId]",
              params: { listingId },
            },
          },
          {
            text: "Upravit",
            size: "sm",
            version: "variantFull",
            iconLeft: "Pencil",
            link: {
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/edit",
              params: { companyId, listingId, variantId },
            },
          },
        ]}
      />

      <div className="flex flex-col gap-4">
        <CompletionWidget
          title="Co doporučujeme vyplnit"
          data={getFullVariantCompletion(variant)}
        />
        <ControlSection
          rows={[
            {
              icon: isActive ? "CircleMinus" : "CircleCheck",
              iconColor: isActive ? "text-amber-500" : "text-success",
              iconBgColor: isActive ? "bg-amber-50" : "bg-success-surface",
              title: isActive ? "Deaktivovat variantu" : "Aktivovat variantu",
              text: isActive
                ? "Varianta přestane být dostupná pro nové poptávky."
                : "Varianta bude opět dostupná pro nové poptávky.",
              button: {
                text: isActive ? "Deaktivovat" : "Aktivovat",
                version: isActive ? "warningFull" : "successFull",
                iconLeft: isActive ? "CircleMinus" : "CircleCheck",
                size: "sm",
                disabled: isUpdating,
                onClick: handleToggleStatus,
              },
            },
            {
              icon: "Trash",
              iconColor: "text-red-500",
              iconBgColor: "bg-red-50",
              title: "Smazat variantu",
              text: "Varianta bude nenávratně smazána. Tuto akci nelze vrátit zpět.",
              button: {
                text: "Smazat",
                version: "dangerFull",
                iconLeft: "Trash",
                size: "sm",
                disabled: isUpdating,
                onClick: () => {
                  confirmActionModalEvents.emit("open", {
                    title: "Smazat variantu",
                    description:
                      "Tato akce je nevratná a trvale odstraní tuto variantu z platformy.",
                    Icon: Trash2,
                    buttonText: "Smazat variantu",
                    buttonVersion: "dangerFull",
                    confirmPhrase: variant.name,
                    whatIsGoingToHappenText:
                      "Opravdu chcete smazat tuto variantu?",
                    whatIsGoingToHappenTextColor: "danger",
                    whatIsGoingToHappenList: [
                      "Varianta zmizí z katalogu a nebude dohledatelná",
                      "Varianta bude u nepotvrzených poptávek označena jako smazaná",
                      "Změna je nevratná",
                    ],
                    bgColor: "bg-danger-surface",
                    onConfirmClick: async () => handleDelete(),
                  });
                },
              },
            },
          ]}
        />

        {basicInfoItems.length > 0 && (
          <DashboardSection
            title="Základní informace"
            icon="Package"
            iconBg="bg-variant-surface"
            iconColor="text-variant"
          >
            <InfoSection items={basicInfoItems} />
          </DashboardSection>
        )}

        {variant.includes?.length || variant.excludes?.length ? (
          <div className="grid grid-cols-2 gap-4">
            {variant.includes?.length && (
              <ItemListCard
                heading="V ceně zahrnuto"
                items={variant.includes.flatMap((inc) => inc.item ?? [])}
                icon="Check"
                iconColor="text-emerald-500"
                iconBgColor="bg-emerald-50"
              />
            )}
            {variant.excludes?.length && (
              <ItemListCard
                heading="Není zahrnuto"
                items={variant.excludes.flatMap((exc) => exc.item ?? [])}
                icon="X"
                iconColor="text-red-400"
                iconBgColor="bg-red-50"
              />
            )}
          </div>
        ) : undefined}

        {variant.price.seasonalPrices?.length ? (
          <DashboardSection
            title="Sezónní ceny"
            icon="Banknote"
            iconBg="bg-amber-100"
            iconColor="text-amber-500"
          >
            <div className="flex flex-col">
              {variant.price.seasonalPrices.map((sp) => (
                <div
                  key={sp.id}
                  className="py-2.5 flex items-center justify-between border-b border-zinc-100 last:border-0"
                >
                  <div className="flex flex-col">
                    {sp.title && (
                      <Text variant="label-lg" color="textDark">
                        {sp.title}
                      </Text>
                    )}
                    <Text variant="label" color="textLight">
                      {format(new Date(sp.from), "dd.MM.yyyy")} –{" "}
                      {format(new Date(sp.to), "dd.MM.yyyy")}
                    </Text>
                  </div>
                  <Text variant="label-lg" color="textDark">
                    {sp.amount} Kč
                  </Text>
                </div>
              ))}
            </div>
          </DashboardSection>
        ) : null}

        {variant.details.map((block, i) => {
          if (block.blockType === "venue")
            return (
              <VariantVenueDetails
                key={i}
                block={block}
                spaces={spaces?.docs}
              />
            );
          if (block.blockType === "gastro")
            return <VariantGastroDetails key={i} block={block} />;
          if (block.blockType === "entertainment")
            return <VariantEntertainmentDetails key={i} block={block} />;
          return null;
        })}
      </div>
    </main>
  );
}
