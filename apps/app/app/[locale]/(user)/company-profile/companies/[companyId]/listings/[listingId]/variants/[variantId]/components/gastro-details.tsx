import Text from "@/app/components/ui/atoms/text";
import { Variant } from "@roo/common";
import { Utensils } from "lucide-react";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import { CapacityText } from "@/app/[locale]/(user)/components/capacity-text";
import { Tag, TagList } from "@/app/[locale]/(user)/components/tag";
import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";

type GastroBlock = Extract<Variant["details"][number], { blockType: "gastro" }>;

export function GastroDetails({ block }: { block: GastroBlock }) {
  return (
    <DashboardSection
      title="Gastronomie"
      icon={Utensils}
      iconBg="bg-orange-50"
      iconColor="text-orange-500"
    >
      <DetailRow label="Kapacita">
        <CapacityText capacity={block.capacity} />
      </DetailRow>
      {block.pricePerPerson != null && (
        <DetailRow label="Cena na osobu">
          <Text variant="body-sm" color="textDark">
            {block.pricePerPerson} Kč
          </Text>
        </DetailRow>
      )}
      {block.minimumOrderCount != null && (
        <DetailRow label="Minimální počet osob">
          <Text variant="body-sm" color="textDark">
            {block.minimumOrderCount}
          </Text>
        </DetailRow>
      )}
      {block.cuisines?.length ? (
        <DetailRow label="Kuchyně">
          <TagList items={block.cuisines} />
        </DetailRow>
      ) : null}
      {block.dishTypes?.length ? (
        <DetailRow label="Typy jídel">
          <TagList items={block.dishTypes} />
        </DetailRow>
      ) : null}
      {block.dietaryOptions?.length ? (
        <DetailRow label="Dietní možnosti">
          <TagList items={block.dietaryOptions} />
        </DetailRow>
      ) : null}
      {block.foodServiceStyle?.length ? (
        <DetailRow label="Způsob podávání">
          <TagList items={block.foodServiceStyle} />
        </DetailRow>
      ) : null}
      {block.personnel?.length ? (
        <DetailRow label="Personál">
          <TagList items={block.personnel} />
        </DetailRow>
      ) : null}
      {block.necessities?.length ? (
        <DetailRow label="Technické požadavky">
          <TagList items={block.necessities} />
        </DetailRow>
      ) : null}
      <DetailRow label="Dětské menu">
        <BoolBadge value={block.kidsMenu} />
      </DetailRow>
      <DetailRow label="Alkohol v ceně">
        <BoolBadge value={block.alcoholIncluded} />
      </DetailRow>
    </DashboardSection>
  );
}
