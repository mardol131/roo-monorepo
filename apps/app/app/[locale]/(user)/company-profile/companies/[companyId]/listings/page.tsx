import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { LISTINGS } from "../../../_mock/mock";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import ListingStatusTag from "@/app/[locale]/(user)/components/listing-status-tag";

type Props = {
  params: Promise<{ companyId: string }>;
};

export default async function page({ params }: Props) {
  const { companyId } = await params;

  return (
    <main className="w-full">
      <PageHeading
        heading="Přehled nabízených služeb"
        description="Zde najdete přehled všech služeb, které vaše firma nabízí. Můžete je spravovat, upravovat nebo přidávat nové služby."
        button={{
          link: {
            pathname: `/company-profile/companies/[companyId]/listings/new-listing`,
            params: { companyId },
          },
          iconLeft: "Plus",
          text: "Přidat službu",
          size: "sm",
          version: "listingFull",
        }}
      />
      <div className="flex flex-col gap-3 mt-6">
        {LISTINGS.map((listing) => (
          <EntityCard
            key={listing.id}
            icon="Briefcase"
            iconColor="text-violet-500"
            iconBackgroundColor="bg-violet-50"
            label={listing.name}
            items={[
              { icon: "MapPin", content: listing.location.address },
              { icon: "Banknote", content: `${listing.price.generalPrice} Kč` },
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
