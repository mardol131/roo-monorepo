import { Listing } from "@roo/common";
import { MapPin } from "lucide-react";
import { InfoRow, resolveNames } from "../listing-ui";
import SectionWrapper from "../section-wrapper";

function ExactLocation({ listing }: { listing: Listing }) {
  const cityName =
    typeof listing.location.city === "string"
      ? listing.location.city
      : (listing.location.city?.name ?? "");

  const mapUrl = `https://maps.google.com/?q=${listing.location.latitude},${listing.location.longitude}`;

  return (
    <SectionWrapper title="Kde nás najdete">
      <div className="flex flex-col gap-2">
        <InfoRow
          icon={<MapPin size={16} />}
          label="Adresa"
          value={`${listing.location.address}${cityName ? `, ${cityName}` : ""}`}
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

function RegionsLocation({ listing }: { listing: Listing }) {
  const cities = resolveNames(
    (listing.location.cities ?? []) as (string | { name: string })[],
  );
  const regions = resolveNames(
    (listing.location.regions ?? []) as (string | { name: string })[],
  );
  const locationParts = [
    listing.location.address,
    ...cities,
    ...regions,
  ].filter(Boolean) as string[];

  if (locationParts.length === 0) return null;

  return (
    <SectionWrapper title="Kde působíme">
      <InfoRow
        icon={<MapPin size={16} />}
        label="Lokalita"
        value={locationParts.join(", ")}
      />
    </SectionWrapper>
  );
}

export default function ListingLocationSection({
  listing,
}: {
  listing: Listing;
}) {
  if (listing.location.type === "exact") return <ExactLocation listing={listing} />;
  return <RegionsLocation listing={listing} />;
}
