"use client";

import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import { CompletionWidget } from "@/app/[locale]/(user)/components/completion-widget";
import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { EntityCompletionBadge } from "@/app/[locale]/(user)/components/entity-completion-badge";
import EntityRow from "@/app/[locale]/(user)/components/entity-row";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import Loader from "@/app/[locale]/(user)/components/loader";
import RowContainer from "@/app/[locale]/(user)/components/row-container";
import EntityComponentTag from "@/app/[locale]/(user)/components/tags/entity-component-tag";
import InquiryStatusTag from "@/app/[locale]/(user)/components/tags/inquiry-status-tag";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import Button from "@/app/components/ui/atoms/button";
import { useAuth } from "@/app/context/auth/auth-context";
import {
  getFullListingCompletion,
  hasListingRights,
} from "@/app/functions/utils/listings";
import { getVariantCompletion } from "@/app/functions/utils/variants";
import { useRouter } from "@/app/i18n/navigation";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { useInquiriesByListing } from "@/app/react-query/inquiries/hooks";
import {
  useListing,
  useListingDetail,
  useUpdateListing,
} from "@/app/react-query/listings/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { getIdFromRelationshipField } from "@roo/common";
import { format } from "date-fns";
import { TagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ListingControlSection } from "./components/control-section";
import { EntertainmentDetails } from "./components/entertainment-details";
import { GastroDetails } from "./components/gastro-details";
import { SpacesSection } from "./components/spaces-section";
import { VenueDetails } from "./components/venue-details";
import ListingAlertsSectionGroup from "./components/listing-alerts-section-group";
import ListingSubscriptionStatusTag from "@/app/[locale]/(user)/components/tags/listing-subscription-status-tag";

export default function Page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const t = useTranslations("global");
  const router = useRouter();
  const { data: listing, isPending } = useListing(listingId);
  const { data: variants } = useVariantsByListing(listingId);
  const { data: inquiries } = useInquiriesByListing(listingId);
  const { data: company } = useCompany(companyId);
  const { mutate: updateListing, isPending: isUpdating } =
    useUpdateListing(companyId);
  const { data: spaces } = useSpacesByListing(listingId);
  const { data: detail, isFetching: isFetchingDetail } = useListingDetail(
    `listing-${listing?.type ? listing.type : "gastro"}-details`,
    listing?.detail?.value
      ? getIdFromRelationshipField(listing?.detail?.value)
      : "",
  );
  const { user } = useAuth();
  const { data: filters } = useFilterOptions();
  if (isPending || isFetchingDetail) return <Loader text="Načítám službu..." />;
  if (!listing || !detail) return router.back();

  //filters

  const listingType = listing.type;

  const headerInfoItems = [
    { icon: "Banknote", text: `od ${listing.minimumPricePerEvent} Kč` },
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

  const getSubType = () => {
    if (listing.type === "entertainment") {
      return filters?.entertainmentTypes?.find(
        (et) => et.id === listing.subType,
      );
    } else if (listing.type === "gastro") {
      return filters?.foodServiceTypes?.find((gt) => gt.id === listing.subType);
    }
  };
  const subType = getSubType();

  const basicInfoItems = [
    ...(subType
      ? [
          {
            type: "text" as const,
            label:
              listing.type === "entertainment"
                ? "Typ programu"
                : "Typ gastro služby",
            value: subType.name,
          },
        ]
      : []),
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
    ...(listing.filters.eventTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy akcí",
            items: listing.filters.eventTypes
              .map((et) => {
                const eventType = filters?.eventTypes?.find((e) => e.id === et);
                return eventType?.name;
              })
              .filter((item) => item !== undefined),
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
        nameSideComponent={[
          <ListingStatusTag status={listing.status} />,
          <ListingSubscriptionStatusTag status={listing.subscriptionStatus} />,
        ]}
        infoItems={headerInfoItems}
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
            version: "listingFull",
            iconLeft: "Pencil",
            link: {
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/edit",
              params: { companyId, listingId },
            },
          },
        ]}
      />

      <div className="flex flex-col gap-4">
        <CompletionWidget
          title="Co doporučujeme vyplnit"
          data={getFullListingCompletion(
            listing,
            detail,
            spaces?.docs?.length,
            variants?.docs?.length,
          )}
        />
        {hasListingRights({
          allowedRoles: ["owner", "admin", "manager"],
          company,
          userId: user?.id,
        }) && <ListingAlertsSectionGroup listing={listing} />}

        {company && listing && (
          <ListingControlSection company={company} listing={listing} />
        )}
        <RowContainer
          icon="MessageSquare"
          iconColor="text-sky-500"
          iconBgColor="bg-sky-50"
          label="Poptávky"
          headerRightComponent={
            <Button
              text="Zobrazit"
              version="plain"
              size="xs"
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/inquiries",
                params: { companyId, listingId },
              }}
            />
          }
          subLabel={
            inquiries?.docs?.length
              ? `${inquiries.docs.length} poptávek`
              : "Žádné poptávky"
          }
          rowComponents={(inquiries?.docs ?? []).map((inquiry) => (
            <EntityRow
              key={inquiry.id}
              icon="MessageSquare"
              iconColor="text-sky-500"
              iconBackgroundColor="bg-sky-50"
              rightComponent={<InquiryStatusTag status={inquiry.status} />}
              label={
                typeof inquiry.event !== "string"
                  ? inquiry.event.name
                  : inquiry.id
              }
              items={[
                ...(inquiry.pricing.agreedPrice != null
                  ? [
                      {
                        icon: "Banknote" as const,
                        content: `${inquiry.pricing.agreedPrice} Kč`,
                      },
                    ]
                  : inquiry.pricing.quotedPrice != null
                    ? [
                        {
                          icon: "Banknote" as const,
                          content: `${inquiry.pricing.quotedPrice} Kč`,
                        },
                      ]
                    : []),
                ...(typeof inquiry.event !== "string"
                  ? [
                      {
                        icon: "Calendar" as const,
                        content: `${format(new Date(inquiry.event.date.start), "d. M. yyyy")} – ${format(new Date(inquiry.event.date.end), "d. M. yyyy")}`,
                      },
                      {
                        icon: "Users" as const,
                        content: `${inquiry.event.guests.adults + inquiry.event.guests.children} hostů`,
                      },
                      {
                        icon: "MapPin" as const,
                        content:
                          typeof inquiry.event.location.district === "object"
                            ? inquiry.event.location.district.name
                            : inquiry.event.location.district,
                      },
                    ]
                  : []),
              ]}
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
                params: { companyId, listingId, inquiryId: inquiry.id },
              }}
            />
          ))}
          emptyState={{
            text: "Tato služba zatím nemá žádné poptávky",
            subtext: "Poptávky od zákazníků se zobrazí zde.",
            icon: "Inbox",
          }}
        />

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
        <RowContainer
          icon="Package"
          iconColor="text-variant"
          iconBgColor="bg-variant-surface"
          label="Varianty"
          headerRightComponent={
            <Button
              text="Zobrazit"
              version="plain"
              size="xs"
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/variants",
                params: { companyId, listingId },
              }}
            />
          }
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
                  content: `max. ${variant.capacity.max} osob`,
                }
              : null;
            return (
              <EntityRow
                key={variant.id}
                icon="Package"
                iconColor="text-variant"
                iconBackgroundColor="bg-variant-surface"
                rightComponent={
                  <EntityCompletionBadge
                    percentage={getVariantCompletion(variant)}
                  />
                }
                label={variant.name}
                items={[
                  {
                    icon: "Banknote",
                    content: `${variant.price.base} Kč`,
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
