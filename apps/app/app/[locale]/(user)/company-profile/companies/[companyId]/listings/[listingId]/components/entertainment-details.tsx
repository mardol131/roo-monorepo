import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";
import { Tag, TagList } from "@/app/[locale]/(user)/components/tag";
import Text from "@/app/components/ui/atoms/text";
import { Listing } from "@roo/common";
import { Clock, MapPin, Music, Users } from "lucide-react";

type EntertainmentBlock = Extract<
  Listing["details"][number],
  { blockType: "entertainment" }
>;

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export function EntertainmentDetails({ block }: { block: EntertainmentBlock }) {
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
        title="Typ programu"
        icon={Music}
        iconBg="bg-purple-50"
        iconColor="text-purple-500"
      >
        {block.entertainmentTypes?.length ? (
          <DetailRow label="Typy programu">
            <TagList items={block.entertainmentTypes} />
          </DetailRow>
        ) : null}
        {block.audience?.length ? (
          <DetailRow label="Cílové publikum">
            <div className="flex flex-wrap gap-1.5">
              {block.audience.map((a) => (
                <Tag key={a} label={AUDIENCE_LABELS[a] ?? a} />
              ))}
            </div>
          </DetailRow>
        ) : null}
      </DashboardSection>

      {block.setupAndTearDownRules && (
        <DashboardSection
          title="Logistika"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        >
          {block.setupAndTearDownRules.setupTime != null ? (
            <DetailRow label="Čas přípravy">
              <Text variant="body-sm" color="textDark">
                {block.setupAndTearDownRules.setupTime} min
              </Text>
            </DetailRow>
          ) : null}
          {block.setupAndTearDownRules.tearDownTime != null ? (
            <DetailRow label="Čas úklidu">
              <Text variant="body-sm" color="textDark">
                {block.setupAndTearDownRules.tearDownTime} min
              </Text>
            </DetailRow>
          ) : null}
        </DashboardSection>
      )}

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
