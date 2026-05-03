"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { Variant } from "@roo/common";
import { useParams } from "next/navigation";

export default function page() {
  const { listingId, companyId } = useParams<{
    companyId: string;
    listingId: string;
  }>();

  const { data: variants, isPending } = useVariantsByListing(listingId);

  if (isPending) return <Loader text="Stránka se načítá..." />;

  console.log(variants);

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
      <CardContainer
        items={variants?.docs || []}
        emptyState={{
          text: "Zatím nemáte žádné varianty",
          subtext:
            "Abyste mohli nabízet různé možnosti vaší služby, musíte nejprve vytvořit variantu. Začněte kliknutím na tlačítko níže.",
          button: {
            text: "Přidat variantu",
            version: "variantFull",
            size: "sm",
            iconLeft: "Plus",
            link: {
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/variants/new",
              params: {
                companyId: companyId,
                listingId: listingId,
              },
            },
          },
          icon: "Building2",
        }}
        renderItem={(item) => {
          const variant = item as Variant;
          return (
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
          );
        }}
      />
    </main>
  );
}
