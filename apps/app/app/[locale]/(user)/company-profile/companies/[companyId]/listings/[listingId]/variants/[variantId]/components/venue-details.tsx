import Text from "@/app/components/ui/atoms/text";
import { Variant } from "@roo/common";
import { Package } from "lucide-react";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import { CapacityText } from "@/app/[locale]/(user)/components/capacity-text";
import { Tag, TagList } from "@/app/[locale]/(user)/components/tag";
import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";
import { DashboardSection } from "../../../../../../../../components/dashboard-section";

type VenueBlock = Extract<Variant["details"][number], { blockType: "venue" }>;

export function VenueDetails({ block }: { block: VenueBlock }) {
  return (
    <DashboardSection
      title="Prostory a vybavení"
      icon={Package}
      iconBg="bg-variant-surface"
      iconColor="text-variant"
    >
      <DetailRow label="Kapacita">
        <CapacityText capacity={block.capacity} />
      </DetailRow>
      {block.includedSpaces?.length ? (
        <DetailRow label="Zahrnuté prostory">
          <TagList items={block.includedSpaces} />
        </DetailRow>
      ) : null}
      {block.activities?.length ? (
        <DetailRow label="Aktivity">
          <TagList items={block.activities} />
        </DetailRow>
      ) : null}
      {block.personnel?.length ? (
        <DetailRow label="Personál">
          <TagList items={block.personnel} />
        </DetailRow>
      ) : null}
      {block.services?.length ? (
        <DetailRow label="Služby">
          <TagList items={block.services} />
        </DetailRow>
      ) : null}
      {block.amenities?.length ? (
        <DetailRow label="Vybavení">
          <TagList items={block.amenities} />
        </DetailRow>
      ) : null}
      {block.technology?.length ? (
        <DetailRow label="Technika">
          <TagList items={block.technology} />
        </DetailRow>
      ) : null}
      <DetailRow label="Rezervace celého prostoru">
        <BoolBadge value={block.canBeBookedAsWhole} />
      </DetailRow>
      <DetailRow label="Ubytování">
        <div className="flex items-center gap-2">
          <BoolBadge value={block.accommodation?.included} />
          {block.accommodation?.included && block.accommodation.capacity && (
            <Text variant="body-sm" color="textLight">
              ({block.accommodation.capacity} lůžek)
            </Text>
          )}
        </div>
      </DetailRow>
      <DetailRow label="Parkování">
        <div className="flex items-center gap-2">
          <BoolBadge value={block.parking?.included} />
          {block.parking?.included && block.parking.spots && (
            <Text variant="body-sm" color="textLight">
              ({block.parking.spots} míst)
            </Text>
          )}
        </div>
      </DetailRow>
      <DetailRow label="Snídaně">
        <div className="flex items-center gap-2">
          <BoolBadge value={block.breakfast?.included} />
          {block.breakfast?.included && block.breakfast.price && (
            <Text variant="body-sm" color="textLight">
              {block.breakfast.loweredPrice
                ? `${block.breakfast.loweredPrice} Kč (běžně ${block.breakfast.price} Kč)`
                : `${block.breakfast.price} Kč`}
            </Text>
          )}
        </div>
      </DetailRow>
    </DashboardSection>
  );
}
