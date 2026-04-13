"use client";

import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useParams } from "next/navigation";

export default function page() {
  const { listingId, companyId } = useParams<{
    companyId: string;
    listingId: string;
  }>();

  const { data: variants } = useVariantsByListing(listingId);

  return (
    <main className="w-full">
      <PageHeading
        heading="Nabízené varianty"
        description="Zde můžete spravovat varianty související s vaší službou."
        button={{
          text: "Přidat variantu",
          version: "variantFull",
          iconLeft: "Plus",
          size: "sm",
          link: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/variants/new",
            params: {
              companyId: companyId,
              listingId: listingId,
            },
          },
        }}
      />
      <div className="flex flex-col gap-3 mt-6">
        {variants?.map((variant) => (
          <EntityCard
            key={variant.id}
            link={{
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]",
              params: {
                companyId: companyId,
                listingId: listingId,
                variantId: variant.id,
              },
            }}
            icon="Package"
            iconColor="text-variant"
            iconBackgroundColor="bg-variant-surface"
            label={variant.name}
            items={[
              {
                icon: "DollarSign",
                content: `${variant.price.generalPrice} Kč`,
              },
              { icon: "CheckCheck", content: variant.availability },
            ]}
          />
        ))}
      </div>
    </main>
  );
}
