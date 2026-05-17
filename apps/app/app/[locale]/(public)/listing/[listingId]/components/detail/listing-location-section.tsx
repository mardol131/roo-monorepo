import { Listing } from "@roo/common";
import { MapPin } from "lucide-react";
import { InfoRow, resolveNames } from "../listing-ui";
import SectionWrapper from "../section-wrapper";

type VenueDetail = Extract<Listing["details"][number], { blockType: "venue" }>;
type OtherDetail = Extract<
  Listing["details"][number],
  { blockType: "gastro" | "entertainment" }
>;

function VenueLocation({ detail }: { detail: VenueDetail }) {
  const cityName =
    typeof detail.location.city === "string"
      ? detail.location.city
      : (detail.location.city?.name ?? "");

  const mapUrl = `https://maps.google.com/?q=${detail.location.latitude},${detail.location.longitude}`;

  return (
    <SectionWrapper title="Kde nás najdete">
      <div className="flex flex-col gap-2">
        <InfoRow
          icon={<MapPin size={16} />}
          label="Adresa"
          value={`${detail.location.address}${cityName ? `, ${cityName}` : ""}`}
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

function OtherLocation({ detail }: { detail: OtherDetail }) {
  const cities = resolveNames(
    (detail.location.city ?? []) as (string | { name: string })[],
  );
  const regions = resolveNames(
    (detail.location.region ?? []) as (string | { name: string })[],
  );
  const locationParts = [detail.location.address, ...cities, ...regions].filter(
    Boolean,
  ) as string[];

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

export default function ListingLocationSection({ listing }: { listing: Listing }) {
  const detail = listing.details[0];
  if (!detail) return null;

  if (detail.blockType === "venue") return <VenueLocation detail={detail} />;
  return <OtherLocation detail={detail} />;
}
