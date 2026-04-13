"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { LISTINGS } from "../../../../../../_mock/mock";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import ListingStatusTag from "@/app/[locale]/(user)/components/tags/listing-status-tag";
import { useParams } from "next/navigation";
import { useListingsByCompany } from "@/app/react-query/listings/hooks";

export default function page() {
  const { companyId } = useParams<{ companyId: string }>();

  const { data: listings } = useListingsByCompany(companyId);

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
      <div className="flex flex-col gap-3 mt-6">
        {listings?.map((listing) => (
          <EntityCard
            key={listing.id}
            icon="Briefcase"
            iconColor="text-listing"
            iconBackgroundColor="bg-listing-surface"
            label={listing.name}
            items={[
              { icon: "MapPin", content: listing.details[0].location.address },
              { icon: "Banknote", content: `${listing.price.startsAt} Kč` },
            ]}
            link={{
              pathname: `/company-profile/companies/[companyId]/listings/[listingId]`,
              params: { companyId, listingId: listing.id },
            }}
            rightComponent={<ListingStatusTag status={listing.status} />}
          />
        ))}
      </div>
    </main>
  );
}
