import { Listing } from "@roo/common";
import { Maximize2, Tag, Users } from "lucide-react";
import { ChipList, InfoRow, resolveNames } from "../listing-ui";
import SectionWrapper from "../section-wrapper";

type VenueDetail = Extract<Listing["details"][number], { blockType: "venue" }>;
type CapacityDetail = Extract<
  Listing["details"][number],
  { blockType: "gastro" | "entertainment" }
>;

const spacesTypeLabels: Record<VenueDetail["spacesType"], string> = {
  area: "Otevřená plocha",
  building: "Budova",
  room: "Místnost",
};

function VenueBasics({
  listing,
  detail,
}: {
  listing: Listing;
  detail: VenueDetail;
}) {
  const placeTypes = resolveNames(detail.placeTypes ?? []);

  return (
    <SectionWrapper title="Základní informace">
      <div className="grid grid-cols-2 gap-3">
        <InfoRow
          icon={<Users size={16} />}
          label="Kapacita"
          value={`${detail.capacity} osob`}
        />
        <InfoRow
          icon={<Maximize2 size={16} />}
          label="Plocha"
          value={`${detail.area} m²`}
        />
        <InfoRow
          icon={<Tag size={16} />}
          label="Typ prostoru"
          value={spacesTypeLabels[detail.spacesType]}
        />
        {(listing.indoor != null || listing.outdoor != null) && (
          <InfoRow
            icon={<Tag size={16} />}
            label="Prostředí"
            value={
              listing.indoor && listing.outdoor
                ? "Interiér i exteriér"
                : listing.indoor
                  ? "Interiér"
                  : "Exteriér"
            }
          />
        )}
      </div>
      {placeTypes.length > 0 && (
        <div className="mt-4">
          <ChipList items={placeTypes} />
        </div>
      )}
    </SectionWrapper>
  );
}

function CapacityBasics({ detail }: { detail: CapacityDetail }) {
  return (
    <SectionWrapper title="Kapacita">
      <div className="flex flex-col gap-2">
        <InfoRow
          icon={<Users size={16} />}
          label="Maximum"
          value={`${detail.capacity} osob`}
        />
        {detail.minimumCapacity != null && (
          <InfoRow
            icon={<Users size={16} />}
            label="Minimum"
            value={`${detail.minimumCapacity} osob`}
          />
        )}
      </div>
    </SectionWrapper>
  );
}

export default function ListingBasicsSection({ listing }: { listing: Listing }) {
  const detail = listing.details[0];
  if (!detail) return null;

  if (detail.blockType === "venue")
    return <VenueBasics listing={listing} detail={detail} />;
  return <CapacityBasics detail={detail} />;
}
