"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import EditVenueListingForm, {
  VENUE_FORM_GROUPS,
} from "./components/edit-venue-listing-form";
import EditGastroListingForm, {
  GASTRO_FORM_GROUPS,
} from "./components/edit-gastro-listing-form";
import EditEntertainmentListingForm, {
  ENTERTAINMENT_FORM_GROUPS,
} from "./components/edit-entertainment-listing-form";
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
        heading="Detailní nastavení"
        description="Zde můžeš upravit všechny detaily vaší služby. Nezapomeň změny uložit!"
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
            <EditGastroListingForm
              onSubmit={(data) => {
                console.log("submit", data);
              }}
              onCancel={() => router.back()}
            />
          )}
          {listing?.details[0].blockType === "entertainment" && (
            <EditEntertainmentListingForm
              onSubmit={(data) => {
                console.log("submit", data);
              }}
              onCancel={() => router.back()}
            />
          )}
        </div>

        {/* TOC sidebar */}
        <div className="w-52 shrink-0 hidden lg:block">
          <div className="flex flex-col gap-5 sticky top-5">
            <FormToc
              groups={
                listing?.details[0].blockType === "gastro"
                  ? GASTRO_FORM_GROUPS
                  : listing?.details[0].blockType === "entertainment"
                    ? ENTERTAINMENT_FORM_GROUPS
                    : VENUE_FORM_GROUPS
              }
              sticky={false}
            />
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
      </div>
    </main>
  );
}
