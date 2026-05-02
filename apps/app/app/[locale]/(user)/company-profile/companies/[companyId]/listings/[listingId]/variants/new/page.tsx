"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import { useListing } from "@/app/react-query/listings/hooks";
import { useCreateVariant } from "@/app/react-query/variants/hooks";
import { useRouter } from "@/app/i18n/navigation";
import { useParams } from "next/navigation";
import NewVariantForm, {
  VariantFormInputs,
} from "./components/new-variant-form";

export default function page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const router = useRouter();
  const { data: listing } = useListing(listingId);
  const { mutate: createVariant } = useCreateVariant({
    onSuccess: () => {
      router.push({
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingId]/variants",
        params: { companyId, listingId },
      });
    },
  });

  const handleSubmit = (data: VariantFormInputs) => {
    const blockType = listing?.details[0]?.blockType;
    if (!blockType) return;

    createVariant({
      listing: listingId,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description ?? null,
      type: data.type,
      availability: data.availability,
      selectedHours: data.selectedHours,
      price: data.price,
      images: {
        mainImage: data.images.mainImage,
        gallery: data.images.gallery.map((image) => ({ image })),
      },
      eventTypes: data.eventTypes.map((et) => et.id),
      includes: data.includes,
      excludes: data.excludes,
      details: [{ blockType, capacity: data.capacity }],
    });
  };

  return (
    <main className="w-full">
      <PageHeading
        heading="Nová varianta"
        description="Zde můžete vytvořit novou variantu služby, kterou budete nabízet zákazníkům."
      />
      <Button
        version="plain"
        iconLeft="ArrowLeft"
        className="mb-4"
        text="Zpět"
        size="sm"
        link={{
          pathname:
            "/company-profile/companies/[companyId]/listings/[listingId]/variants",
          params: {
            companyId,
            listingId,
          },
        }}
      />
      <NewVariantForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </main>
  );
}
