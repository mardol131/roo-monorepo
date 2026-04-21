"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";
import EditVenueListingForm, {
  VENUE_FORM_GROUPS,
} from "./components/edit-venue-listing-form";
import { useListing } from "@/app/react-query/listings/hooks";
import FormToc from "@/app/[locale]/(user)/components/form-toc";
import Button from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";
import { useParams } from "next/navigation";

type Props = {};

export default function page({}: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: listing } = useListing(listingId);
  const isVenue = listing?.details[0].blockType === "venue";
  const router = useRouter();

  return (
    <main className="w-full">
      <PageHeading
        heading="Založení nové služby"
        description="Zde můžete vytvořit novou službu, kterou budete nabízet zákazníkům. Jde pouze o základní nastavení, zbytek lze pak upravit v editaci služby."
      />

      <div className="flex gap-6">
        {/* Form */}
        <div className="flex-1 min-w-0">
          {isVenue && (
            <EditVenueListingForm
              onSubmit={(data) => {
                console.log("submit", data);
              }}
              onCancel={() => router.back()}
            />
          )}
          {listing?.details[0].blockType === "gastro" && (
            <p className="text-zinc-400 text-sm">
              Formulář pro gastronomii bude doplněn.
            </p>
          )}
          {listing?.details[0].blockType === "entertainment" && (
            <p className="text-zinc-400 text-sm">
              Formulář pro zábavu bude doplněn.
            </p>
          )}
        </div>

        {/* TOC sidebar */}
        {isVenue && (
          <div className="w-52 shrink-0 hidden lg:block">
            <div className="flex flex-col gap-5 sticky top-5">
              <FormToc groups={VENUE_FORM_GROUPS} sticky={false} />
              <div className="flex flex-col gap-2">
                <Button
                  text="Přejít na uložení"
                  version="listingFull"
                  className="w-full"
                  onClick={() => {
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }}
                />
                <Button
                  text="Zrušit"
                  version="plain"
                  className="w-full"
                  onClick={() => router.back()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
