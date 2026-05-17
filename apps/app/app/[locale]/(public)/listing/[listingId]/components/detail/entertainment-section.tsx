import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";
import { Clock } from "lucide-react";

type EntertainmentDetail = Extract<
  Listing["details"][number],
  { blockType: "entertainment" }
>;

interface Props {
  detail: EntertainmentDetail;
}

const audienceLabels: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export default function EntertainmentSection({ detail }: Props) {
  const entertainmentTypes = resolveNames(detail.entertainmentTypes ?? []);
  const rules = resolveNames(detail.rules ?? []);
  const necessities = resolveNames(detail.necessities ?? []);

  const audience = (detail.audience ?? []).map((a) => audienceLabels[a] ?? a);

  return (
    <>
      {entertainmentTypes.length > 0 && (
        <SectionWrapper title="Typy zábavy">
          <ChipList items={entertainmentTypes} />
        </SectionWrapper>
      )}

      {audience.length > 0 && (
        <SectionWrapper title="Cílové publikum">
          <ChipList items={audience} />
        </SectionWrapper>
      )}

      {(detail.setupAndTearDownRules.setupTime != null ||
        detail.setupAndTearDownRules.tearDownTime != null) && (
        <SectionWrapper title="Příprava a úklid">
          <div className="flex flex-col gap-2">
            {detail.setupAndTearDownRules.setupTime != null && (
              <InfoRow
                icon={<Clock size={16} />}
                label="Příprava"
                value={`${detail.setupAndTearDownRules.setupTime} min`}
              />
            )}
            {detail.setupAndTearDownRules.tearDownTime != null && (
              <InfoRow
                icon={<Clock size={16} />}
                label="Úklid"
                value={`${detail.setupAndTearDownRules.tearDownTime} min`}
              />
            )}
          </div>
        </SectionWrapper>
      )}

      {rules.length > 0 && (
        <SectionWrapper title="Pravidla">
          <ChipList items={rules} />
        </SectionWrapper>
      )}

      {necessities.length > 0 && (
        <SectionWrapper title="Požadavky">
          <ChipList items={necessities} />
        </SectionWrapper>
      )}
    </>
  );
}
