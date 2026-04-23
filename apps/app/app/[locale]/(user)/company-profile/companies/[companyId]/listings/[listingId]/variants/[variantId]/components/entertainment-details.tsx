import Text from "@/app/components/ui/atoms/text";
import { Variant } from "@roo/common";
import { Music } from "lucide-react";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import { CapacityText } from "@/app/[locale]/(user)/components/capacity-text";
import { Tag, TagList } from "@/app/[locale]/(user)/components/tag";
import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";

type EntertainmentBlock = Extract<
  Variant["details"][number],
  { blockType: "entertainment" }
>;

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export function EntertainmentDetails({ block }: { block: EntertainmentBlock }) {
  return (
    <DashboardSection
      title="Zábavní program"
      icon={Music}
      iconBg="bg-purple-50"
      iconColor="text-purple-500"
    >
      <DetailRow label="Kapacita">
        <CapacityText capacity={block.capacity} />
      </DetailRow>
      {block.performanceDuration != null && (
        <DetailRow label="Délka vystoupení">
          <Text variant="body-sm" color="textDark">
            {block.performanceDuration} min
          </Text>
        </DetailRow>
      )}
      {block.numberOfSets != null && (
        <DetailRow label="Počet setů">
          <Text variant="body-sm" color="textDark">
            {block.numberOfSets}
          </Text>
        </DetailRow>
      )}
      {block.breakDuration != null && (
        <DetailRow label="Délka přestávky mezi sety">
          <Text variant="body-sm" color="textDark">
            {block.breakDuration} min
          </Text>
        </DetailRow>
      )}
      {block.audience?.length ? (
        <DetailRow label="Cílové publikum">
          <div className="flex flex-wrap gap-1.5">
            {block.audience.map((a) => (
              <Tag key={a} label={AUDIENCE_LABELS[a] ?? a} />
            ))}
          </div>
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
      {block.setupAndTeardown && (
        <>
          <DetailRow label="Příprava a úklid v ceně">
            <BoolBadge value={block.setupAndTeardown.included} />
          </DetailRow>
          {block.setupAndTeardown.setupTime != null && (
            <DetailRow label="Čas přípravy">
              <Text variant="body-sm" color="textDark">
                {block.setupAndTeardown.setupTime} min
              </Text>
            </DetailRow>
          )}
          {block.setupAndTeardown.teardownTime != null && (
            <DetailRow label="Čas úklidu">
              <Text variant="body-sm" color="textDark">
                {block.setupAndTeardown.teardownTime} min
              </Text>
            </DetailRow>
          )}
        </>
      )}
    </DashboardSection>
  );
}
