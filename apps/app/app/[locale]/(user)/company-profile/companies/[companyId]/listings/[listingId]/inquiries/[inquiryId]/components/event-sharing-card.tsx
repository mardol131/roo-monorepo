import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import {
  getIdFromRelationshipField,
  type Event,
  type Inquiry,
} from "@roo/common";
import { Building2, MapPin, Music, UtensilsCrossed, Users } from "lucide-react";
import Link from "next/link";

type Props = {
  event: Event;
  inquiries: Inquiry[];
  contactUser: Inquiry["user"];
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
  const hasAny =
    sharing.contactDetails || sharing.confirmedInquiries || sharing.place;
  if (!hasAny) return null;

  const user = typeof contactUser !== "string" ? contactUser : null;

  const showInfoSection = sharing.contactDetails || sharing.place;

  return (
    <DashboardSection
      title="Informace o eventu"
      icon="Share2"
      iconBg="bg-zinc-100"
      iconColor="text-zinc-500"
    >
      <div className="flex flex-col gap-6">
        {showInfoSection && (
          <div className="grid grid-cols-2 gap-6">
            {sharing.contactDetails && user && (
              <section className="flex flex-col gap-2">
                <SectionLabel>Kontakt zákazníka</SectionLabel>
                <div>
                  <DetailRow label="Jméno">
                    <Text variant="body-sm" color="textDark">
                      {user.firstName} {user.lastName}
                    </Text>
                  </DetailRow>
                  <DetailRow label="Email">
                    <Text variant="body-sm" color="textDark">
                      {user.email}
                    </Text>
                  </DetailRow>
                  {user.phone && (
                    <DetailRow label="Telefon">
                      <Text variant="body-sm" color="textDark">
                        {user.phone.countryCode} {user.phone.number}
                      </Text>
                    </DetailRow>
                  )}
                </div>
              </section>
            )}

            {sharing.place && location && location.length > 0 && (
              <section className="flex flex-col gap-2">
                <SectionLabel>Místo konání</SectionLabel>
                <div>
                  {location.map((block, i) => {
                    if (block.blockType === "venue") {
                      const venue =
                        typeof block.venue !== "string" && block.venue
                          ? block.venue
                          : null;
                      return (
                        <DetailRow key={i} label="Venue">
                          <div className="flex items-center justify-between">
                            <Text variant="body-sm" color="textDark">
                              {venue?.name ?? "—"}
                            </Text>
                            {venue && (
                              <Link
                                href={`/listing/${venue.id}`}
                                className="text-xs text-blue-500 hover:underline shrink-0"
                              >
                                Zobrazit v katalogu
                              </Link>
                            )}
                          </div>
                        </DetailRow>
                      );
                    }

                    if (block.blockType === "custom") {
                      const cityName =
                        typeof block.city !== "string"
                          ? block.city.name
                          : block.city;
                      return (
                        <div key={i}>
                          <DetailRow label="Město">
                            <Text variant="body-sm" color="textDark">
                              {cityName}
                            </Text>
                          </DetailRow>
                          {block.address && (
                            <DetailRow label="Adresa">
                              <Text variant="body-sm" color="textDark">
                                {block.address}
                              </Text>
                            </DetailRow>
                          )}
                          {block.description && (
                            <DetailRow label="Poznámka">
                              <Text variant="body-sm" color="secondary">
                                {block.description}
                              </Text>
                            </DetailRow>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {sharing.confirmedInquiries && inquiries.length > 0 && (
          <section className="flex flex-col gap-2">
            <SectionLabel>Potvrzení dodavatelé</SectionLabel>
            <div className="flex flex-col gap-1">
              {inquiries.map((inq, index) => {
                const listing =
                  typeof inq.listing !== "string" ? inq.listing : null;
                return (
                  <EntityCard
                    key={inq.id}
                    icon={"MessageSquare"}
                    iconColor="text-space"
                    iconBackgroundColor="bg-space-surface"
                    label={listing?.name ?? `Poptávka #${index + 1}`}
                    plain
                    link={{
                      pathname: "/listing/[listingId]",
                      params: {
                        listingId: getIdFromRelationshipField(inq.listing),
                      },
                    }}
                    target="_blank"
                    items={[]}
                    rightComponent={
                      <Button text="Zobrazit" version="plain" size="xs" />
                    }
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </DashboardSection>
  );
}
