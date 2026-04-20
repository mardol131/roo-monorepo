"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "next/navigation";
import NewListingForm, { FORM_GROUPS } from "./components/new-listing-form";
import FormToc from "@/app/[locale]/(user)/components/form-toc";
import { useState } from "react";
import Button from "@/app/components/ui/atoms/button";
import IconCard from "./components/icon-card";
import { LucideIcons } from "@roo/common";
import { ListingType } from "./components/new-listing-form";

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
        <div className="flex-1 min-w-0">
          <NewListingForm
            type={selectedType}
            onSubmit={(data) => console.log("submit", data)}
            onCancel={() => router.back()}
          />
        </div>

        <div className="w-52 shrink-0 hidden lg:block">
          <FormToc groups={FORM_GROUPS[selectedType]} />
        </div>
      </div>
    </main>
  );
}
