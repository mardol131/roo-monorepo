"use client";

import { Listing } from "@roo/common";
import { MapPin } from "lucide-react";
import { InfoRow } from "../listing-ui";
import SectionWrapper from "../section-wrapper";

function ExactLocation({ listing }: { listing: Listing }) {
  const { address, city, latitude, longitude } = listing.location;
  const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

  return (
    <SectionWrapper title="Kde nás najdete">
      <div className="flex flex-col gap-2">
        <InfoRow
          icon={<MapPin size={16} />}
          label="Adresa"
          value={`${address}${city ? `, ${city}` : ""}`}
        />
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline-offset-2 hover:underline ml-7"
        >
          Zobrazit na mapě
        </a>
      </div>
    </SectionWrapper>
  );
}

function ServiceableArea({ listing }: { listing: Listing }) {
  const { wholeCountry, regions, districts, cities } = listing.servicableArea;

  if (wholeCountry) {
    return (
      <SectionWrapper title="Kde působíme">
        <InfoRow icon={<MapPin size={16} />} label="Oblast" value="Celá ČR" />
      </SectionWrapper>
    );
  }

  const parts = [
    ...(regions ?? []),
    ...(districts ?? []),
    ...(cities ?? []),
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <SectionWrapper title="Kde působíme">
      <InfoRow
        icon={<MapPin size={16} />}
        label="Oblast"
        value={parts.join(", ")}
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
