"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import { hasListingRights } from "@/app/functions/utils/listings";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import { useCompany } from "@/app/react-query/companies/hooks";
import {
  useDeleteListing,
  useListingsByCompany,
  useUpdateListing,
} from "@/app/react-query/listings/hooks";
import { Listing } from "@roo/common";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function page() {
  const { companyId } = useParams<{ companyId: string }>();
  const t = useTranslations("global");
  const { user } = useAuth();
  const { data: company } = useCompany(companyId);

  const { data: listings, isLoading } = useListingsByCompany(companyId);

  const { mutate: updateListing } = useUpdateListing(companyId);

  if (isLoading) {
    return <Loader text="Seznam se načítá..." />;
  }

  const handleDeleteConfirm = async (listingId: string) => {
    updateListing({ id: listingId, data: { status: "archived" } });
  };

  return (
    <main className="w-full">
      <PageHeading
        heading="Přehled nabízených služeb"
        description="Zde najdete přehled všech služeb, které vaše firma nabízí. Můžete je spravovat, upravovat nebo přidávat nové služby."
        button={
          hasListingRights({
            company,
            userId: user?.id,
            allowedRoles: ["owner", "admin", "manager"],
          })
            ? {
                link: {
                  pathname: `/company-profile/companies/[companyId]/listings/new`,
                  params: { companyId },
                },
                iconLeft: "Plus",
                text: "Přidat službu",
                size: "sm",
                version: "listingFull",
              }
            : undefined
        }
      />
      <CardContainer
        emptyState={{
          text: "V tuto vaše firma nenabízí žádnou službu",
          subtext:
            "Máte vytvořenou firmou, ale firma ještě nemá žádnou službu, kterou by mohla nabízet. Pro přídání služby klikněte na tlačítko Přidat službu",
          icon: "MessageSquare",
          button: hasListingRights({
            company,
            userId: user?.id,
            allowedRoles: ["owner", "admin", "manager"],
          })
            ? {
                text: "Přidat službu",
                version: "listingFull",
                size: "sm",
                iconLeft: "Plus",
                link: {
                  pathname: `/company-profile/companies/[companyId]/listings/new`,
                  params: { companyId },
                },
              }
            : undefined,
        }}
        items={listings?.docs ?? []}
        renderItem={(item) => {
          const listing = item as Listing;
          listings && listings?.docs?.length;
          return (
            <EntityCard
              key={listing.id}
              icon="Tag"
              iconColor="text-listing"
              iconBackgroundColor="bg-listing-surface"
              label={listing.name}
              items={[
                {
                  icon: "MapPin",
                  content: t(`listings.type.${listing.type}`),
                },
                {
                  icon: "Banknote",
                  content: `${listing.price.startsAt} Kč`,
                },
                ...(listing.location?.address
                  ? [
                      {
                        icon: "MapPin",
                        content: listing.location.address,
                      } as const,
                    ]
                  : []),
              ]}
              link={{
                pathname: `/company-profile/companies/[companyId]/listings/[listingId]`,
                params: { companyId, listingId: listing.id },
              }}
              rightComponent={<ListingStatusTag status={listing.status} />}
              deleteEntityHandler={
                hasListingRights({
                  company,
                  userId: user?.id,
                  allowedRoles: ["owner", "admin", "manager"],
                })
                  ? (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      confirmActionModalEvents.emit("open", {
                        title: "Smazat službu",
                        description:
                          "Tato akce je nevratná a trvale odstraní tuto službu z platformy.",
                        Icon: Trash2,
                        buttonText: "Smazat službu",
                        buttonVersion: "dangerFull",
                        confirmPhrase: listing.name,
                        whatIsGoingToHappenText:
                          "Opravdu chcete smazat tuto službu?",
                        whatIsGoingToHappenTextColor: "danger",
                        whatIsGoingToHappenList: [
                          "Služba zmizí z katalogu a nebude dohledatelná",
                          "Varianty a prostory, které jsou pod touto službou, budou smazány.",
                          "Změna je nevratná",
                        ],
                        bgColor: "bg-danger-surface",
                        onConfirmClick: () => handleDeleteConfirm(listing.id),
                      });
                    }
                  : undefined
              }
            />
          );
        }}
      />
    </main>
  );
}
