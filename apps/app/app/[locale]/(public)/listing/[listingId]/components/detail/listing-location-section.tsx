"use client";

import { getIdFromRelationshipField, Listing } from "@roo/common";
import { MapPin } from "lucide-react";
import { InfoRow } from "../listing-ui";
import SectionWrapper from "../section-wrapper";
import { useCity } from "@/app/react-query/cities/hooks";
import ListingMap from "./listing-map";

function ExactLocation({ listing }: { listing: Listing }) {
  const loc = listing.location;

  const cityRecord = useCity(getIdFromRelationshipField(loc.city), {
    enabled: typeof loc.city === "string",
  });

  const city = () => {
    if (typeof loc.city === "string") {
      return cityRecord.data?.name ?? "";
    }
    return loc.city?.name ?? "";
  };

  return (
    <SectionWrapper title="Kde nás najdete">
      <div className="flex flex-col gap-4">
        <InfoRow
          icon={<MapPin size={16} />}
          label="Adresa a město"
          value={`${loc.address}, ${city()}`}
        />
        <ListingMap listing={listing} />
      </div>
    </SectionWrapper>
  );
}

function ServiceableArea({ listing }: { listing: Listing }) {
  const { wholeCountry, maxTravelDistanceKm } = listing.servicableArea as {
    wholeCountry: boolean;
    maxTravelDistanceKm?: number | null;
  };

  if (wholeCountry) {
    return (
      <SectionWrapper title="Kde působíme">
        <InfoRow icon={<MapPin size={16} />} label="Oblast" value="Celá ČR" />
      </SectionWrapper>
    );
  }

  if (!maxTravelDistanceKm) return null;

  return (
    <SectionWrapper title="Kde působíme">
      <InfoRow
        icon={<MapPin size={16} />}
        label="Dojezdová vzdálenost"
        value={`Do ${maxTravelDistanceKm} km od základny`}
      />
    </SectionWrapper>
  );
}

export default function ListingLocationSection({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <>
      <ExactLocation listing={listing} />
      <ServiceableArea listing={listing} />
    </>
  );
}
