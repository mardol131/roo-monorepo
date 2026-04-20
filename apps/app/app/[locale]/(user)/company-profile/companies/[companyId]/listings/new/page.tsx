"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "next/navigation";
import NewVenueListingForm, {
  VENUE_FORM_GROUPS,
} from "./components/new-venue-listing-form";
import FormToc from "@/app/[locale]/(user)/components/form-toc";
import { useState } from "react";
import { ArrowLeft, Building2, Music, UtensilsCrossed } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import IconCard from "./components/icon-card";
import { LucideIcons } from "@roo/common";

type ListingType = "venue" | "gastro" | "entertainment";

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

  const isVenue = selectedType === "venue";

  return (
    <main className="w-full">
      <PageHeading
        heading="Založení nové služby"
        description="Zde můžete vytvořit novou službu, kterou budete nabízet zákazníkům. Jde pouze o základní nastavení, zbytek lze pak upravit v editaci služby."
      />

      <Button
        version="plain"
        onClick={() => setSelectedType(null)}
        iconLeft="ArrowLeft"
        className="mb-4"
        text="Zpět na výběr typu služby"
        size="sm"
      />

      <div className="flex gap-6">
        {/* Form */}
        <div className="flex-1 min-w-0">
          {isVenue && (
            <NewVenueListingForm
              onSubmit={(data) => {
                console.log("submit", data);
              }}
              onCancel={() => router.back()}
            />
          )}
          {selectedType === "gastro" && (
            <p className="text-zinc-400 text-sm">
              Formulář pro gastronomii bude doplněn.
            </p>
          )}
          {selectedType === "entertainment" && (
            <p className="text-zinc-400 text-sm">
              Formulář pro zábavu bude doplněn.
            </p>
          )}
        </div>

        {/* TOC sidebar */}
        {isVenue && (
          <div className="w-52 shrink-0 hidden lg:block">
            <FormToc groups={VENUE_FORM_GROUPS} />
          </div>
        )}
      </div>
    </main>
  );
}
