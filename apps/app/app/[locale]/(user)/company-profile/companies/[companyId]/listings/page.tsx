"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { LISTINGS } from "../../../../../../_mock/mock";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import { useParams } from "next/navigation";
import { useListingsByCompany } from "@/app/react-query/listings/hooks";
import CardContainer from "@/app/[locale]/(user)/components/card-container";
import { Listing } from "@roo/common";
import Loader from "@/app/[locale]/(user)/components/loader";

export default function page() {
  const { companyId } = useParams<{ companyId: string }>();

  const { data: listings, isLoading } = useListingsByCompany(companyId);

  if (isLoading) {
    return <Loader text="Seznam se načítá..." />;
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Přehled nabízených služeb"
        description="Zde najdete přehled všech služeb, které vaše firma nabízí. Můžete je spravovat, upravovat nebo přidávat nové služby."
        button={{
          link: {
            pathname: `/company-profile/companies/[companyId]/listings/new`,
            params: { companyId },
          },
          iconLeft: "Plus",
          text: "Přidat službu",
          size: "sm",
          version: "listingFull",
        }}
      />
      <CardContainer
        emptyState={{
          text: "V tuto vaše firma nenabízí žádnou službu",
          subtext:
            "Máte vytvořenou firmou, ale firma ještě nemá žádnou službu, kterou by mohla nabízet. Pro přídání služby klikněte na tlačítko Přidat službu",
          icon: "MessageSquare",
          button: {
            text: "Přidat službu",
            version: "listingFull",
            size: "sm",
            iconLeft: "Plus",
            link: {
              pathname: `/company-profile/companies/[companyId]/listings/new`,
              params: { companyId },
            },
          },
        }}
        items={listings?.docs ?? []}
        renderItem={(item) => {
          const listing = item as Listing;
          listings && listings.docs.length > 0;
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
                  content: listing?.details[0]?.location?.address,
                },
                {
                  icon: "Banknote",
                  content: `${listing.price.startsAt} Kč`,
                },
              ]}
              link={{
                pathname: `/company-profile/companies/[companyId]/listings/[listingId]`,
                params: { companyId, listingId: listing.id },
              }}
              rightComponent={<ListingStatusTag status={listing.status} />}
            />
          );
        }}
      />
    </main>
  );
}
