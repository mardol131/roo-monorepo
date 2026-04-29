"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import { Listing, LucideIcons } from "@roo/common";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import IconCard from "./components/icon-card";
import NewListingForm, {
  ListingType,
  NewListingFormInputs,
} from "./components/new-listing-form";
import { CreateListingPayload } from "@/app/react-query/listings/fetch";
import { useCreateListing } from "@/app/react-query/listings/hooks";

const LISTING_TYPES: {
  type: ListingType;
  label: string;
  description: string;
  icon: LucideIcons;
}[] = [
  {
    type: "venue",
    label: "Prostory",
    description: "Pronájem prostor pro soukromé nebo firemní akce",
    icon: "Building2",
  },
  {
    type: "gastro",
    label: "Gastronomie",
    description: "Catering, rauty, cateringové služby a stravování",
    icon: "UtensilsCrossed",
  },
  {
    type: "entertainment",
    label: "Zábava",
    description: "Kulturní program, hudba, moderátoři a animátoři",
    icon: "Music",
  },
];

export default function NewListingPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ListingType | null>(null);
  const { companyId } = useParams<{ companyId: string }>();
  const { mutate } = useCreateListing();

  function handleSubmit(data: NewListingFormInputs) {
    const locationBase = {
      address: data.location.address,
      region: data.location.regions,
      district: data.location.districts,
      city: data.location.cities,
    };

    const details: CreateListingPayload["details"] =
      selectedType === "venue"
        ? [
            {
              location: {
                address: data.location.address ?? "",
                city: data.location.city ?? "",
              },
              spacesType: data.spaceType ?? "room",
              capacity: data.capacity,
              area: data.area ?? 0,
              blockType: "venue",
            },
          ]
        : selectedType === "gastro"
          ? [
              {
                location: locationBase,
                capacity: data.capacity,
                minimumCapacity: data.minimumCapacity,
                cuisines: data.cuisines,
                dishTypes: data.dishTypes,
                dietaryOptions: data.dietaryOptions,
                foodServiceStyles: data.foodServiceStyles,
                hasAlcoholLicense: data.hasAlcoholLicense,
                kidsMenu: data.kidsMenu,
                necessities: data.necessities,
                blockType: "gastro",
              },
            ]
          : [
              {
                location: locationBase,
                capacity: data.capacity,
                minimumCapacity: data.minimumCapacity,
                entertainmentTypes: data.entertainmentTypes,
                audience: data.audience,
                setupAndTearDownRules: {
                  setupTime: data.setupTime,
                  tearDownTime: data.tearDownTime,
                },
                necessities: data.necessities,
                blockType: "entertainment",
              },
            ];

    const payload: CreateListingPayload = {
      company: companyId,
      name: data.name,
      images: {
        coverImage: data.images.coverImage,
        logo: data.images.logo,
        gallery: data.images.gallery.map((url) => ({ url })),
      },
      price: { startsAt: data.price.startsAt },
      details,
    };

    mutate(payload);
  }

  if (!selectedType) {
    return (
      <main className="w-full">
        <PageHeading
          heading="Nová služba"
          description="Vyberte typ služby, kterou chcete nabízet zákazníkům."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {LISTING_TYPES.map(({ type, label, description, icon }) => (
            <IconCard
              key={type}
              label={label}
              description={description}
              icon={icon}
              onClick={() => setSelectedType(type)}
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Založení nové služby"
        description="Zde můžete vytvořit novou službu, kterou budete nabízet zákazníkům. Jde pouze o základní nastavení, zbytek lze pak upravit v editaci služby."
      />

      <Button
        version="listing"
        onClick={() => setSelectedType(null)}
        iconLeft="ArrowLeft"
        className="mb-4"
        text="Zpět na výběr typu služby"
        size="sm"
      />
      <NewListingForm
        type={selectedType}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </main>
  );
}
