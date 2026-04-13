"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "next/navigation";
import NewVenueListingForm, {
  VENUE_FORM_SECTIONS,
} from "./components/new-venue-listing-form";
import FormToc from "@/app/[locale]/(user)/components/form-toc";
import { useState } from "react";
import { ArrowLeft, Building2, Music, UtensilsCrossed } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";

type ListingType = "venue" | "gastro" | "entertainment";

const LISTING_TYPES: {
  type: ListingType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    type: "venue",
    label: "Prostory",
    description: "Pronájem prostor pro soukromé nebo firemní akce",
    icon: Building2,
  },
  {
    type: "gastro",
    label: "Gastronomie",
    description: "Catering, rauty, cateringové služby a stravování",
    icon: UtensilsCrossed,
  },
  {
    type: "entertainment",
    label: "Zábava",
    description: "Kulturní program, hudba, moderátoři a animátoři",
    icon: Music,
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
          {LISTING_TYPES.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="flex cursor-pointer flex-col items-start gap-3 p-6 rounded-2xl border border-zinc-200 bg-white hover:border-listing hover:bg-listing-surface transition-all text-left group"
            >
              <div className="p-3 rounded-xl bg-zinc-100 group-hover:bg-listing/10 transition-colors">
                <Icon className="w-6 h-6 text-zinc-500 group-hover:text-listing transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <Text variant="subheading2">{label}</Text>
                <Text variant="label2" color="light">
                  {description}
                </Text>
              </div>
            </button>
          ))}
        </div>
      </main>
    );
  }

  const formSections = selectedType === "venue" ? VENUE_FORM_SECTIONS : [];

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
          {selectedType === "venue" && (
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
        {formSections.length > 0 && (
          <div className="w-52 shrink-0 hidden lg:block">
            <FormToc sections={formSections} />
          </div>
        )}
      </div>
    </main>
  );
}
