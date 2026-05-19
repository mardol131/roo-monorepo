"use client";

import DashboardSectionHeader from "@/app/[locale]/(user)/components/dashboard-section-header";
import EntityRow from "@/app/[locale]/(user)/components/entity-row";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { Event, Inquiry, Listing } from "@roo/common";

type Props = {
  event: Event;
  confirmedVenueInquiries: Inquiry[];
  onSetVenue: (venueId: string) => void;
};

export default function EventLocationSection({
  event,
  confirmedVenueInquiries,
  onSetVenue,
}: Props) {
  const loc = event.location;

  const subHeading = () => {
    if (event.location?.type === "custom") return undefined;
    if (event.location?.type === "venue" && event.location.venue)
      return "Vaše místo konání";
    return "Vyberte potvrzené venue, které chcete nastavit jako místo konání:";
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <DashboardSectionHeader
        heading="Místo konání"
        subheading={subHeading()}
        icon="MapPin"
        iconBgColor="bg-violet-50"
        iconColor="text-violet-500"
      />

      {/* Custom — InfoSection rows have their own vertical padding, add horizontal */}
      {loc?.type === "custom" && (
        <div className="p-5">
          <InfoSection
            items={[
              {
                type: "text",
                label: "Město",
                value: loc.city
                  ? typeof loc.city === "string"
                    ? loc.city
                    : loc.city.name
                  : null,
              },
              ...(loc.address
                ? [
                    {
                      type: "text",
                      label: "Adresa",
                      value: loc.address,
                    } as const,
                  ]
                : []),
              {
                type: "text",
                label: "Typ prostoru",
                value: loc.spaceType
                  ? typeof loc.spaceType === "string"
                    ? loc.spaceType
                    : loc.spaceType.name
                  : null,
              },
              ...(loc.description
                ? [
                    {
                      type: "text",
                      label: "Popis místa konání",
                      value: loc.description,
                    } as const,
                  ]
                : []),
            ]}
          />
        </div>
      )}

      {/* Venue set — EntityRow carries its own px-6 py-4 */}
      {loc?.type === "venue" &&
        loc.venue &&
        (() => {
          const venueId =
            typeof loc.venue === "string" ? loc.venue : loc.venue!.id;
          const venueName =
            typeof loc.venue === "string" ? loc.venue : loc.venue!.name;
          return (
            <EntityRow
              icon="Building2"
              iconColor="text-violet-500"
              iconBackgroundColor="bg-violet-50"
              label={venueName}
              items={[{ icon: "MapPin", content: "Venue z katalogu" }]}
              link={{
                pathname: "/listing/[listingId]",
                params: { listingId: venueId },
              }}
            />
          );
        })()}

      {/* Venue type but no venue selected yet */}
      {loc?.type === "venue" &&
        !loc.venue &&
        (confirmedVenueInquiries.length > 0 ? (
          <>
            <div className="divide-y divide-zinc-100">
              {confirmedVenueInquiries.map((inquiry) => {
                const listing = inquiry.listing as Listing;
                if (!listing || typeof listing === "string") return null;
                return (
                  <EntityRow
                    key={inquiry.id}
                    icon="Building2"
                    iconColor="text-violet-500"
                    iconBackgroundColor="bg-violet-50"
                    label={listing.name}
                    items={[]}
                    rightComponent={
                      <Button
                        text="Nastavit"
                        version="eventFull"
                        size="sm"
                        onClick={() => onSetVenue(listing.id)}
                      />
                    }
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="px-5 py-4 flex flex-col gap-3">
            <Text variant="body-sm" color="textLight">
              Zatím nemáte žádné potvrzené venue. Přejděte do katalogu, najděte
              místo a poptejte jej — po potvrzení jej budete moct nastavit jako
              místo konání.
            </Text>
            <Button
              text="Hledat venue v katalogu"
              version="eventFull"
              size="sm"
              iconLeft="Search"
              link={{ pathname: "/catalog/venue" }}
            />
          </div>
        ))}
    </div>
  );
}
