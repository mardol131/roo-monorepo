"use client";

import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import EntityRow from "@/app/[locale]/(user)/components/entity-row";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import Loader from "@/app/[locale]/(user)/components/loader";
import RowContainer from "@/app/[locale]/(user)/components/row-container";
import EntityComponentTag from "@/app/[locale]/(user)/components/tags/entity-component-tag";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import Button from "@/app/components/ui/atoms/button";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { useRouter } from "@/app/i18n/navigation";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  useDeleteListing,
  useListing,
  useListingDetail,
  useUpdateListing,
} from "@/app/react-query/listings/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { getIdFromRelationshipField } from "@roo/common";
import { TagIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ControlSection } from "../../../../../components/control-section";
import { EntertainmentDetails } from "./components/entertainment-details";
import { GastroDetails } from "./components/gastro-details";
import { ListingCompletion } from "./components/listing-completion";
import { SpacesSection } from "./components/spaces-section";
import { VenueDetails } from "./components/venue-details";

// ── Constants ─────────────────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const t = useTranslations();
  const router = useRouter();
  const { data: listing, isPending } = useListing(listingId);
  const { data: variants } = useVariantsByListing(listingId);
  const { mutate: updateListing, isPending: isUpdating } =
    useUpdateListing(companyId);
  const { data: spaces } = useSpacesByListing(listingId);
  const { data: detail, isFetching: isFetchingDetail } = useListingDetail(
    `listing-${listing?.type ? listing.type : "gastro"}-details`,
    listing?.detail?.value
      ? getIdFromRelationshipField(listing?.detail?.value)
      : "",
  );
  const { data: filters } = useFilterOptions();
  if (isPending || isFetchingDetail) return <Loader text="Načítám službu..." />;
  if (!listing || !detail) return router.back();

  //filters

  const isActive = listing.status === "active";

  const handleToggleStatus = () => {
    updateListing({
      id: listingId,
      data: { status: isActive ? "inactive" : "active" },
    });
  };

  const handleDeleteConfirm = () => {
    updateListing(
      {
        id: listingId,
        data: { status: "archived" },
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  const openDeleteConfirmModal = () =>
    confirmActionModalEvents.emit("open", {
      title: "Smazat službu",
      description:
        "Tato akce je nevratná a trvale odstraní tuto službu z platformy.",
      Icon: Trash2,
      buttonText: "Smazat službu",
      buttonVersion: "dangerFull",
      confirmPhrase: listing.name,
      whatIsGoingToHappenText: "Opravdu chcete smazat tuto službu?",
      whatIsGoingToHappenTextColor: "danger",
      whatIsGoingToHappenList: [
        "Služba zmizí z katalogu a nebude dohledatelná",
        "Veškerá data, fotografie a nastavení budou trvale odstraněna",
        "Platby za tuto službu se přestanou strhávat",
      ],
      bgColor: "bg-danger-surface",
      onConfirmClick: async () => {
        handleDeleteConfirm();
      },
    });

  const listingType = listing.type;

  const headerInfoItems = [
    { icon: "Banknote", text: `od ${listing.price.startsAt} Kč` },
    ...(listingType
      ? [{ icon: "Tag", text: t(`listings.type.${listingType}`) }]
      : []),
    ...(listing.indoor && listing.outdoor
      ? [{ icon: "Sun", text: "Interiér i exteriér" }]
      : listing.indoor
        ? [{ icon: "Home", text: "Interiér" }]
        : listing.outdoor
          ? [{ icon: "Trees", text: "Exteriér" }]
          : []),
  ];

  const basicInfoItems = [
    ...(listing.shortDescription
      ? [
          {
            type: "text" as const,
            label: "Krátký popis",
            value: listing.shortDescription,
          },
        ]
      : []),
    ...(listing.description
      ? [
          {
            type: "text" as const,
            label: "Popis",
            value: listing.description,
          },
        ]
      : []),
    ...(listing.properties.eventTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy akcí",
            items: listing.properties.eventTypes.map(
              (et) => filters?.eventTypes?.find((e) => e.id === et)?.name || et,
            ),
          },
        ]
      : []),
    ...(listing.indoor != null
      ? [
          {
            type: "boolean" as const,
            label: "Interiér",
            value: listing.indoor,
          },
        ]
      : []),
    ...(listing.outdoor != null
      ? [
          {
            type: "boolean" as const,
            label: "Exteriér",
            value: listing.outdoor,
          },
        ]
      : []),
    ...(listing.guests?.max != null
      ? [
          {
            type: "text" as const,
            label: "Max. hostů",
            value: `${listing.guests.max} osob`,
          },
        ]
      : []),
    ...(listing.guests?.min != null
      ? [
          {
            type: "text" as const,
            label: "Min. hostů",
            value: `${listing.guests.min} osob`,
          },
        ]
      : []),
    ...(listing.guests?.ztp
      ? [
          {
            type: "boolean" as const,
            label: "Bezbariérový přístup",
            value: true,
          },
        ]
      : []),
    ...(listing.guests?.pets
      ? [{ type: "boolean" as const, label: "Zvířata vítána", value: true }]
      : []),
  ];

  return (
    <main className="w-full">
      <Breadcrumbs />
      <DashboardHeader
        icon={TagIcon}
        iconBg="bg-listing-surface"
        iconColor="text-listing"
        name={listing.name}
        nameSideComponent={<ListingStatusTag status={listing.status} />}
        infoItems={headerInfoItems}
        button={{
          text: "Upravit",
          size: "sm",
          version: "listingFull",
          iconLeft: "Pencil",
          link: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/edit",
            params: { companyId, listingId },
          },
        }}
      />

      <div className="flex flex-col gap-4">
        <ListingCompletion
          listing={listing}
          detail={detail}
          companyId={companyId}
          listingId={listingId}
          spacesCount={spaces?.docs?.length || 0}
        />
        <ControlSection
          rows={[
            {
              icon: isActive ? "CircleMinus" : "CircleCheck",
              iconColor: isActive ? "text-amber-500" : "text-success",
              iconBgColor: isActive ? "bg-amber-50" : "bg-success-surface",
              title: isActive ? "Deaktivovat službu" : "Aktivovat službu",
              text: isActive
                ? "Služba přestane být zobrazována v katalogu. Kdykoli ji lze znovu aktivovat."
                : "Po aktivaci budete přesměrováni do platební brány. Služba se zobrazí v katalogu po úspěšné platbě.",
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
              icon: "Trash2",
              iconColor: "text-danger",
              iconBgColor: "bg-danger-surface",
              title: "Smazat službu",
              text: "Trvalé smazání nelze vrátit zpět. Všechna data budou odstraněna.",
              button: {
                text: "Smazat",
                version: "dangerFull",
                iconLeft: "Trash2",
                size: "sm",
                onClick: openDeleteConfirmModal,
              },
            },
          ]}
        />

        <RowContainer
          icon="Package"
          iconColor="text-violet-500"
          iconBgColor="bg-violet-50"
          label="Varianty"
          subLabel={
            variants?.docs?.length
              ? `${variants.docs?.length} variant`
              : "Žádné varianty"
          }
          rowComponents={(variants?.docs ?? []).map((variant) => {
            const firstBlock = variant.details[0];
            const capacityItem = firstBlock
              ? {
                  icon: "Users" as const,
                  content: `max. ${firstBlock.capacity.max} osob`,
                }
              : null;
            return (
              <EntityRow
                key={variant.id}
                icon="Package"
                iconColor="text-variant"
                iconBackgroundColor="bg-variant-surface"
                label={variant.name}
                items={[
                  {
                    icon: "Banknote",
                    content: `${variant.price.generalPrice} Kč`,
                  },
                  ...(capacityItem ? [capacityItem] : []),
                ]}
                link={{
                  pathname:
                    "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]",
                  params: { companyId, listingId, variantId: variant.id },
                }}
              />
            );
          })}
          emptyState={{
            text: "Tato služba nemá žádné varianty",
            subtext:
              "Varianty umožňují nabízet různé konfigurace služby s odlišnou cenou, kapacitou nebo vybavením. Pro přidání varianty klikněte na tlačítko Přidat variantu.",
            icon: "Package",
            button: {
              text: "Přidat variantu",
              version: "variantFull",
              size: "sm",
              iconLeft: "Plus",
              link: {
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/variants/new",
                params: { companyId, listingId },
              },
            },
          }}
        />

        <SpacesSection listingId={listingId} companyId={companyId} />

        {basicInfoItems.length > 0 && (
          <DashboardSection
            title="Základní informace"
            icon={"Package"}
            iconBg="bg-listing-surface"
            iconColor="text-listing"
          >
            <InfoSection items={basicInfoItems} />
          </DashboardSection>
        )}
        {listing.type === "entertainment" &&
          detail &&
          detail.type === "entertainment" && (
            <EntertainmentDetails listing={listing} detail={detail} />
          )}
        {listing.type === "gastro" && detail && detail.type === "gastro" && (
          <GastroDetails listing={listing} detail={detail} />
        )}
        {listing.type === "venue" && detail && detail.type === "venue" && (
          <VenueDetails listing={listing} detail={detail} />
        )}
        {listing.properties.technologies?.length && (
          <DashboardSection
            title="Technologie"
            icon={"Zap"}
            iconBg="bg-cyan-50"
            iconColor="text-cyan-500"
          >
            {listing.properties.technologies?.length && (
              <InfoSection
                items={[
                  {
                    type: "tagList",
                    label: "Vybavení",
                    items: listing.properties.technologies.map(
                      (tech) =>
                        filters?.technologies?.find((t) => t.id === tech)
                          ?.name || tech,
                    ),
                  },
                ]}
              />
            )}
          </DashboardSection>
        )}
        {/* 
        {listing.properties.rules?.length ? (
          <DashboardSection
            title="Pravidla"
            icon={"Shield"}
            iconBg="bg-red-50"
            iconColor="text-red-400"
          >
            <InfoSection
              items={[
                {
                  type: "tagList",
                  label: "Pravidla",
                  items: listing.rules,
                },
              ]}
            />
          </DashboardSection>
        ) : null} */}

        <RowContainer
          icon="User"
          iconColor="text-violet-500"
          iconBgColor="bg-violet-50"
          label="Zaměstnanci"
          subLabel={`${detail.employees?.length} osob`}
          headerRightComponent={
            <Button
              text="Upravit"
              version="plain"
              size="xs"
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/edit",
                params: {
                  companyId,
                  listingId,
                },
                query: { section: "section-employees" },
              }}
            />
          }
          rowComponents={
            detail.employees?.length
              ? detail.employees?.map((emp, i) => (
                  <EntityRow
                    items={[]}
                    key={i}
                    label={emp.name}
                    icon="User"
                    iconBackgroundColor="bg-violet-50"
                    iconColor="text-violet-500"
                  />
                ))
              : []
          }
          emptyState={{
            button: {
              text: "Přidat zaměstnance",
              version: "listingFull",
              size: "sm",
              iconLeft: "Plus",
              link: {
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/edit",
                params: { companyId, listingId },
                query: { section: "section-employees" },
              },
            },
            text: "Nemáte vytvořené žádné zaměstnance",
            subtext:
              "Zaměstnanci jsou osoby, které pracují ve vaší firmě a mohou být přiřazeni k rezervacím. Pro přidání zaměstnance klikněte na tlačítko Přidat zaměstnance.",
          }}
        />

        <RowContainer
          icon="Star"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-50"
          label="Reference"
          headerRightComponent={
            <Button
              text="Upravit"
              version="plain"
              size="xs"
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/edit",
                params: {
                  companyId,
                  listingId,
                },
                query: { section: "section-references" },
              }}
            />
          }
          subLabel={`${detail?.references?.length} referencí`}
          rowComponents={
            detail.references?.length
              ? detail.references?.map((ref, i) => (
                  <EntityRow
                    items={[
                      ...(ref.eventName
                        ? [
                            {
                              icon: "Star" as const,
                              content: ref.eventName,
                            } as const,
                          ]
                        : []),
                      ...(ref.clientName
                        ? [
                            {
                              icon: "User" as const,
                              content: ref.clientName,
                            } as const,
                          ]
                        : []),
                      ...(ref.description
                        ? [
                            {
                              icon: "Tag" as const,
                              content: ref.description,
                            } as const,
                          ]
                        : []),
                    ]}
                    label={ref.eventName}
                    icon="Star"
                    iconBackgroundColor="bg-yellow-50"
                    iconColor="text-yellow-500"
                  />
                ))
              : []
          }
          emptyState={{
            text: "Nemáte žádné reference",
            button: {
              text: "Přidat referenci",
              version: "listingFull",
              size: "sm",
              iconLeft: "Plus",
              link: {
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/edit",
                params: { companyId, listingId },
                query: { section: "section-references" },
              },
            },
            subtext:
              "Reference jsou záznamy o vašich předchozích zakázkách, které mohou obsahovat informace o klientovi, typu akce, počtu hostů a další. Pro přidání reference klikněte na tlačítko Přidat referenci.",
          }}
        />
        <RowContainer
          icon="TableOfContents"
          iconColor="text-violet-500"
          iconBgColor="bg-violet-50"
          label="FAQ"
          subLabel={`Počet otázek:${detail?.faq?.length}`}
          headerRightComponent={
            <Button
              text="Upravit"
              version="plain"
              size="xs"
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/edit",
                params: {
                  companyId,
                  listingId,
                },
                query: { section: "section-faq" },
              }}
            />
          }
          rowComponents={
            detail.faq?.length
              ? detail.faq?.map((item, i) => (
                  <EntityRow
                    items={[
                      {
                        icon: "TableOfContents",
                        content: item.answer,
                      },
                    ]}
                    rightComponent={
                      <EntityComponentTag
                        text={item.active ? "Aktivní" : "Neaktivní"}
                        bgColor={
                          item.active ? "bg-success-surface" : "bg-gray-200"
                        }
                        textColor={
                          item.active ? "text-success" : "text-gray-500"
                        }
                      />
                    }
                    key={i}
                    label={item.question}
                    icon="TableOfContents"
                    iconBackgroundColor="bg-violet-50"
                    iconColor="text-violet-500"
                  />
                ))
              : []
          }
          emptyState={{
            button: {
              text: "Přidat otázku do FAQ",
              version: "listingFull",
              size: "sm",
              iconLeft: "Plus",
              link: {
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/edit",
                params: { companyId, listingId },
                query: { section: "section-faq" },
              },
            },
            text: "Nemáte žádné otázky do FAQ",
            subtext:
              "FAQ jsou často kladené otázky, které mohou obsahovat informace o vašich službách, produktech nebo procesech. Pro přidání otázky klikněte na tlačítko Přidat otázku.",
          }}
        />
      </div>
    </main>
  );
}
