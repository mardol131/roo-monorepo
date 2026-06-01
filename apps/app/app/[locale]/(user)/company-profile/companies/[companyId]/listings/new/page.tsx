"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import { Listing, LucideIcons } from "@roo/common";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IconCard from "./components/icon-card";
import VenueWizard from "../../../../../../../components/forms/listings/create-wizards/venue-wizard";
import GastroWizard from "../../../../../../../components/forms/listings/create-wizards/gastro-wizard";
import EntertainmentWizard from "../../../../../../../components/forms/listings/create-wizards/entertainment-wizard";
import { useTranslations } from "next-intl";

const LISTING_TYPES: {
  type: Listing["type"];
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
  const [selectedType, setSelectedType] = useState<Listing["type"] | null>(
    null,
  );
  const t = useTranslations("global");

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
    <main className="w-full pb-100">
      <PageHeading
        button={{
          version: "listingFull",
          onClick: () => setSelectedType(null),
          iconLeft: "ArrowLeft",
          className: "mb-4",
          text: "Zpět na výběr typu služby",
          size: "sm",
        }}
        heading={`Založení nové služby ${selectedType ? `- ${t(`listings.type.${selectedType}`)}` : ""}`}
        description="Zde můžete vytvořit novou službu, kterou budete nabízet zákazníkům. Jde pouze o základní nastavení, zbytek lze pak upravit v editaci služby."
      />

      {selectedType === "venue" && (
        <VenueWizard onCancel={() => setSelectedType(null)} />
      )}
      {selectedType === "gastro" && (
        <GastroWizard onCancel={() => setSelectedType(null)} />
      )}
      {selectedType === "entertainment" && (
        <EntertainmentWizard onCancel={() => setSelectedType(null)} />
      )}
    </main>
  );
}
