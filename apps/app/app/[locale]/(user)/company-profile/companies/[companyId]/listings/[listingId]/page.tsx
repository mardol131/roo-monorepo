"use client";

import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";
import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import EntityRow from "@/app/[locale]/(user)/components/entity-row";
import Loader from "@/app/[locale]/(user)/components/loader";
import RowContainer from "@/app/[locale]/(user)/components/row-container";
import { TagList } from "@/app/[locale]/(user)/components/tag";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import Text from "@/app/components/ui/atoms/text";
import DeleteEntityModal from "@/app/components/ui/molecules/modals/delete-entity-modal";
import { useRouter } from "@/app/i18n/navigation";
import {
  useDeleteListing,
  useListing,
  useUpdateListing,
} from "@/app/react-query/listings/hooks";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import {
  CircleCheck,
  CircleMinus,
  HelpCircle,
  Package,
  Shield,
  Star,
  TagIcon,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ControlSection } from "../../../../../components/control-section";
import { EntertainmentDetails } from "./components/entertainment-details";
import { GastroDetails } from "./components/gastro-details";
import { VenueDetails } from "./components/venue-details";

// ── Constants ─────────────────────────────────────────────────────────────────

const FAQ_GROUP_LABELS: Record<string, string> = {
  general: "Obecné",
  booking: "Rezervace",
  cancellation: "Storno",
  payment: "Platba",
  other: "Ostatní",
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  venue: "Venue",
  gastro: "Gastronomie",
  entertainment: "Zábavní program",
};

// ── Page ──────────────────────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const router = useRouter();
  const { data: listing, isPending } = useListing(listingId);
  const { data: variants } = useVariantsByListing(listingId);
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing(
    listingId,
    companyId,
  );
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing(
    listingId,
    companyId,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isPending) return <Loader text="Načítám službu..." />;
  if (!listing) return router.back();

  const isActive = listing.status === "active";

  const handleToggleStatus = () => {
    updateListing({ status: isActive ? "archived" : "active" });
  };

  const handleDeleteConfirm = async () => {
    deleteListing(undefined, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.back();
      },
    });
  };

  const listingType = listing.details[0]?.blockType;

  const infoItems = [
    { icon: "Banknote", text: `od ${listing.price.startsAt} Kč` },
    ...(listingType
      ? [{ icon: "Tag", text: LISTING_TYPE_LABELS[listingType] ?? listingType }]
      : []),
    ...(listing.indoor && listing.outdoor
      ? [{ icon: "Sun", text: "Interiér i exteriér" }]
      : listing.indoor
        ? [{ icon: "Home", text: "Interiér" }]
        : listing.outdoor
          ? [{ icon: "Trees", text: "Exteriér" }]
          : []),
  ];

  const activeFaq = listing.faq?.filter((f) => f.active) ?? [];

  return (
    <main className="w-full">
      <Breadcrumbs />
      <DashboardHeader
        icon={TagIcon}
        iconBg="bg-listing-surface"
        iconColor="text-listing"
        name={listing.name}
        nameSideComponent={<ListingStatusTag status={listing.status} />}
        infoItems={infoItems}
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
        <ControlSection
          rows={[
            {
              icon: isActive ? CircleMinus : CircleCheck,
              iconColor: isActive ? "text-amber-500" : "text-success",
              iconBgColor: isActive ? "bg-amber-50" : "bg-success-surface",
              title: isActive ? "Deaktivovat službu" : "Aktivovat službu",
              text: isActive
                ? "Služba přestane být zobrazována v katalogu. Kdykoli ji lze znovu aktivovat."
                : "Po aktivaci budete přesměrováni do platební brány. Služba se zobrazí v katalogu po úspěšné platbě.",
              button: {
                text: isActive ? "Deaktivovat" : "Aktivovat",
                version: isActive ? "outlined" : "successFull",
                iconLeft: isActive ? "CircleMinus" : "CircleCheck",
                size: "sm",
                disabled: isUpdating,
                onClick: handleToggleStatus,
              },
            },
            {
              icon: Trash2,
              iconColor: "text-danger",
              iconBgColor: "bg-danger-surface",
              title: "Smazat službu",
              text: "Trvalé smazání nelze vrátit zpět. Všechna data budou odstraněna.",
              button: {
                text: "Smazat",
                version: "dangerFull",
                iconLeft: "Trash2",
                size: "sm",
                onClick: () => setShowDeleteModal(true),
              },
            },
          ]}
        />

        {/* Modal: potvrzení smazání */}
        <DeleteEntityModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDeleteConfirmClick={handleDeleteConfirm}
          isDeleting={isDeleting}
          whatIsGoingToHappenList={[
            "Služba zmizí z katalogu a nebude dohledatelná",
            "Veškerá data, fotografie a nastavení budou trvale odstraněna",
            "Platby za tuto službu se přestanou strhávat",
          ]}
        />
        <RowContainer
          icon={<Package className="w-4 h-4 text-violet-500" />}
          label="Varianty"
          subLabel={
            variants?.length ? `${variants.length} variant` : "Žádné varianty"
          }
          rowComponents={(variants ?? []).map((variant) => {
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
          emptyHeading="Žádné varianty"
          emptyText="Zatím nebyly přidány žádné varianty"
        />
        {/* Základní informace */}
        {(listing.shortDescription ||
          listing.description ||
          listing.eventTypes?.length ||
          listing.indoor != null ||
          listing.outdoor != null) && (
          <DashboardSection
            title="Základní informace"
            icon={Package}
            iconBg="bg-listing-surface"
            iconColor="text-listing"
          >
            {listing.shortDescription && (
              <DetailRow label="Krátký popis">
                <Text variant="body-sm" color="textLight">
                  {listing.shortDescription}
                </Text>
              </DetailRow>
            )}
            {listing.description && (
              <DetailRow label="Popis">
                <Text variant="body-sm" color="textDark">
                  {listing.description}
                </Text>
              </DetailRow>
            )}
            {listing.eventTypes?.length ? (
              <DetailRow label="Typy akcí">
                <TagList items={listing.eventTypes} />
              </DetailRow>
            ) : null}
            {listing.indoor != null && (
              <DetailRow label="Interiér">
                <BoolBadge value={listing.indoor} />
              </DetailRow>
            )}
            {listing.outdoor != null && (
              <DetailRow label="Exteriér">
                <BoolBadge value={listing.outdoor} />
              </DetailRow>
            )}
          </DashboardSection>
        )}

        {/* Detail bloky (venue / gastro / entertainment) */}
        {listing.details.map((block, i) => {
          if (block.blockType === "venue")
            return <VenueDetails key={i} block={block} />;
          if (block.blockType === "gastro")
            return <GastroDetails key={i} block={block} />;
          if (block.blockType === "entertainment")
            return <EntertainmentDetails key={i} block={block} />;
          return null;
        })}

        {/* Technologie (top-level) */}
        {listing.technologies?.length ? (
          <DashboardSection
            title="Technologie"
            icon={Zap}
            iconBg="bg-cyan-50"
            iconColor="text-cyan-500"
          >
            <DetailRow label="Vybavení">
              <TagList items={listing.technologies} />
            </DetailRow>
          </DashboardSection>
        ) : null}

        {/* Pravidla (top-level) */}
        {listing.rules?.length ? (
          <DashboardSection
            title="Pravidla"
            icon={Shield}
            iconBg="bg-red-50"
            iconColor="text-red-400"
          >
            <DetailRow label="Pravidla">
              <TagList items={listing.rules} />
            </DetailRow>
          </DashboardSection>
        ) : null}

        {/* Zaměstnanci */}
        {listing.employees?.length ? (
          <RowContainer
            icon={<Users className="w-4 h-4 text-violet-500" />}
            label="Zaměstnanci"
            subLabel={`${listing.employees.length} osob`}
            rowComponents={listing.employees.map((emp, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-violet-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <Text
                    variant="label-lg"
                    color="textDark"
                    className="font-medium"
                  >
                    {emp.name}
                  </Text>
                  <Text variant="caption" color="secondary">
                    {emp.role}
                  </Text>
                  {emp.description && (
                    <Text variant="caption" color="secondary">
                      {emp.description}
                    </Text>
                  )}
                </div>
              </div>
            ))}
            emptyHeading="Žádní zaměstnanci"
          />
        ) : null}

        {/* Reference */}
        {listing.references?.length ? (
          <RowContainer
            icon={<Star className="w-4 h-4 text-violet-500" />}
            label="Reference"
            subLabel={`${listing.references.length} referencí`}
            rowComponents={listing.references.map((ref, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-violet-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <Text
                    variant="label-lg"
                    color="textDark"
                    className="font-medium"
                  >
                    {ref.eventName ?? "—"}
                  </Text>
                  {ref.clientName && (
                    <Text variant="caption" color="secondary">
                      {ref.clientName}
                    </Text>
                  )}
                  {ref.eventType &&
                    typeof ref.eventType !== "string" &&
                    ref.eventType && (
                      <Text variant="caption" color="secondary">
                        {(ref.eventType as { name: string }).name}
                      </Text>
                    )}
                </div>
              </div>
            ))}
            emptyHeading="Žádné reference"
          />
        ) : null}

        {/* FAQ */}
        {activeFaq.length > 0 && (
          <DashboardSection
            title="Časté otázky"
            icon={HelpCircle}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
          >
            {activeFaq.map((item, i) => (
              <div
                key={i}
                className="py-2.5 border-b border-zinc-100 last:border-0"
              >
                {item.groupedBy && (
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 mb-1">
                    {FAQ_GROUP_LABELS[item.groupedBy] ?? item.groupedBy}
                  </span>
                )}
                <Text
                  variant="label-lg"
                  color="textDark"
                  className="font-medium block mb-0.5"
                >
                  {item.question}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {item.answer}
                </Text>
              </div>
            ))}
          </DashboardSection>
        )}

        {/* Varianty */}
      </div>
    </main>
  );
}
