"use client";

import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import EntityComponentTag from "@/app/[locale]/(user)/components/tags/entity-component-tag";
import { useInquiriesByListing } from "@/app/react-query/inquiries/hooks";
import { format } from "date-fns";
import { useParams } from "next/navigation";

export default function page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const { data: inquiries } = useInquiriesByListing(listingId);

  return (
    <main className="w-full">
      <PageHeading
        heading="Zprávy"
        description="Poptávky s nepřečtenými zprávami."
      />

      {inquiries?.length === 0 ? (
        <EmptyState
          text="Zatím žádné zprávy"
          subtext="Zprávy se zobrazí, jakmile zákazníci projeví zájem o vaši službu."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries?.map((inquiry) => (
            <EntityCard
              key={inquiry.id}
              label={
                typeof inquiry.listing.value !== "string"
                  ? inquiry.listing.value.name
                  : "Poptávka"
              }
              icon="MessageSquare"
              iconBackgroundColor="bg-inquiry-surface"
              iconColor="text-inquiry"
              items={[
                {
                  icon: "Banknote",
                  content: `${inquiry.pricing.quotedPrice ? `${inquiry.pricing.quotedPrice} Kč (nabídka)` : inquiry.pricing.agreedPrice ? `${inquiry.pricing.agreedPrice} Kč (dohodnutá cena)` : "Cena neuvedena"}`,
                },
                {
                  icon: "Calendar",
                  content: `${inquiry.variant ? "Varianta" : "Zákaznická poptávka"}`,
                },
              ]}
              labelComponent={
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 self-center" />
              }
              rightComponent={
                inquiry.activity.lastUserMessageSentAt ? (
                  <EntityComponentTag
                    bgColor="bg-zinc-100"
                    textColor="text-text-light"
                    text={format(
                      new Date(inquiry.activity.lastUserMessageSentAt),
                      "dd.MM.yyyy",
                    )}
                  />
                ) : undefined
              }
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
                params: {
                  companyId,
                  listingId,
                  inquiryId: inquiry.id,
                },
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
