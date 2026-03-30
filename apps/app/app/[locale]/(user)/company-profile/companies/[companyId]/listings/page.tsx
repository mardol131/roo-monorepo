import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import ListingCard from "../../../../components/collection-components/listing-card";
import { LISTINGS } from "../../../_mock/mock";

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
      />
      <div className="flex flex-col gap-3 mt-6">
        {LISTINGS.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            companyId={companyId}
          />
        ))}
      </div>
    </main>
  );
}
