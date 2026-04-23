import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";
import { TagList } from "@/app/[locale]/(user)/components/tag";
import Text from "@/app/components/ui/atoms/text";
import { Listing } from "@roo/common";
import { MapPin, Users, Utensils } from "lucide-react";

type GastroBlock = Extract<Listing["details"][number], { blockType: "gastro" }>;

export function GastroDetails({ block }: { block: GastroBlock }) {
  return (
    <>
      {block.location && (
        <DashboardSection
          title="Místo působení"
          icon={MapPin}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        >
          {block.location.region?.length ? (
            <DetailRow label="Kraj">
              <TagList items={block.location.region} />
            </DetailRow>
          ) : null}
          {block.location.district?.length ? (
            <DetailRow label="Okres">
              <TagList items={block.location.district} />
            </DetailRow>
          ) : null}
          {block.location.city?.length ? (
            <DetailRow label="Město">
              <TagList items={block.location.city} />
            </DetailRow>
          ) : null}
          {block.location.address ? (
            <DetailRow label="Adresa">
              <Text variant="body-sm" color="textDark">
                {block.location.address}
              </Text>
            </DetailRow>
          ) : null}
        </DashboardSection>
      )}

      <DashboardSection
        title="Kapacita"
        icon={Users}
        iconBg="bg-listing-surface"
        iconColor="text-listing"
      >
        <DetailRow label="Maximální kapacita">
          <Text variant="body-sm" color="textDark">
            {block.capacity} osob
          </Text>
        </DetailRow>
        {block.minimumCapacity ? (
          <DetailRow label="Minimální kapacita">
            <Text variant="body-sm" color="textDark">
              {block.minimumCapacity} osob
            </Text>
          </DetailRow>
        ) : null}
      </DashboardSection>

      <DashboardSection
        title="Nabídka"
        icon={Utensils}
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
      >
        {block.cuisines?.length ? (
          <DetailRow label="Kuchyně">
            <TagList items={block.cuisines} />
          </DetailRow>
        ) : null}
        {block.dishTypes?.length ? (
          <DetailRow label="Typy pokrmů">
            <TagList items={block.dishTypes} />
          </DetailRow>
        ) : null}
        {block.dietaryOptions?.length ? (
          <DetailRow label="Dietní možnosti">
            <TagList items={block.dietaryOptions} />
          </DetailRow>
        ) : null}
        {block.foodServiceStyles?.length ? (
          <DetailRow label="Styl servisu">
            <TagList items={block.foodServiceStyles} />
          </DetailRow>
        ) : null}
        <DetailRow label="Alkoholová licence">
          <BoolBadge value={block.hasAlcoholLicense} />
        </DetailRow>
        <DetailRow label="Dětské menu">
          <BoolBadge value={block.kidsMenu} />
        </DetailRow>
      </DashboardSection>

      {block.personnel?.length || block.necessities?.length ? (
        <DashboardSection
          title="Personál a požadavky"
          icon={Users}
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
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
        </DashboardSection>
      ) : null}
    </>
  );
}
