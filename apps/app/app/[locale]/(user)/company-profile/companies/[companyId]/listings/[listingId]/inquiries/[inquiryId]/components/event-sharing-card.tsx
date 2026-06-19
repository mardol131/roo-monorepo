import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { AcceptedInquiryPublicData } from "@/app/react-query/inquiries/fetch";
import { Inquiry, type Event } from "@roo/common";
import { Building2, MapPin, Music, UtensilsCrossed, Users } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  event: Event;
  inquiries: AcceptedInquiryPublicData[];
  contactUser: Event["contactPerson"];
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5">
      <Text
        variant="label-lg"
        color="secondary"
        className="tracking-wide font-semibold"
      >
        {children}
      </Text>
    </div>
  );
}

export default function EventSharingCard({
  event,
  inquiries,
  contactUser,
}: Props) {
  const { sharing, location } = event;
  const t = useTranslations("global.listings");

  return (
    <DashboardSection
      title="Informace o eventu"
      icon="Share2"
      iconBg="bg-zinc-100"
      iconColor="text-zinc-500"
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          {contactUser && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Kontakt zákazníka</SectionLabel>
              <div>
                <DetailRow label="Jméno">
                  <Text variant="label" color="textDark">
                    {contactUser.name}
                  </Text>
                </DetailRow>
                <DetailRow label="Email">
                  <Text variant="label" color="textDark">
                    {contactUser.email}
                  </Text>
                </DetailRow>
                {contactUser.phone && (
                  <DetailRow label="Telefon">
                    <Text variant="label" color="textDark">
                      + {contactUser.phone.countryCode}{" "}
                      {contactUser.phone.number}
                    </Text>
                  </DetailRow>
                )}
              </div>
            </section>
          )}

          {sharing.place && location && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Místo konání</SectionLabel>
              <div>
                <DetailRow label="Okres">
                  <Text variant="label" color="textDark">
                    {typeof location.district === "object"
                      ? location.district.name
                      : null}
                  </Text>
                </DetailRow>
                {location.city && typeof location.city === "object" && (
                  <DetailRow label="Město">
                    <Text variant="label" color="textDark">
                      {location.city.name}
                    </Text>
                  </DetailRow>
                )}
                {location.address && (
                  <DetailRow label="Adresa">
                    <Text variant="label" color="textDark">
                      {location.address}
                    </Text>
                  </DetailRow>
                )}
                {location.description && (
                  <DetailRow label="Poznámka">
                    <Text variant="label" color="secondary">
                      {location.description}
                    </Text>
                  </DetailRow>
                )}
              </div>
            </section>
          )}
        </div>

        {sharing.confirmedInquiries && inquiries.length > 0 && (
          <section className="flex flex-col gap-2">
            <SectionLabel>Potvrzení dodavatelé</SectionLabel>
            <div className="flex flex-col gap-1">
              {inquiries.map((inq, index) => (
                <EntityCard
                  key={inq.listing.id}
                  icon={"MessageSquare"}
                  iconColor="text-space"
                  iconBackgroundColor="bg-space-surface"
                  label={inq.listing.name ?? `Dodavatel #${index + 1}`}
                  plain
                  link={{
                    pathname: "/listing/[listingId]",
                    params: { listingId: inq.listing.id },
                  }}
                  target="_blank"
                  items={
                    inq.listing.type
                      ? [
                          {
                            icon: "Box" as const,
                            content: t(`type.${inq.listing.type}`),
                          },
                        ]
                      : []
                  }
                  rightComponent={
                    <Button text="Zobrazit" version="plain" size="xs" />
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardSection>
  );
}
