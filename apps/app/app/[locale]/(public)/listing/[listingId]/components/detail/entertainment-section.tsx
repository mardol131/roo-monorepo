"use client";

import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow } from "../listing-ui";
import { Listing, ListingEntertainmentDetail } from "@roo/common";
import { Clock } from "lucide-react";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";

interface Props {
  detail: ListingEntertainmentDetail;
  listing: Listing;
}

const audienceLabels: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export default function EntertainmentSection({ detail, listing }: Props) {
  const { data: filters } = useFilterOptions();

  const entertainmentTypes = (
    listing.properties.entertainmentTypes ?? []
  ).flatMap((id) => {
    const found = filters?.entertainmentTypes.find((e) => e.id === id);
    return found ? [found.name] : [];
  });
  const rules = (listing.properties.entertainmentRules ?? []).flatMap((id) => {
    const found = filters?.rules.find((e) => e.id === id);
    return found ? [found.name] : [];
  });
  const necessities = (listing.properties.necessities ?? []).flatMap((id) => {
    const found = filters?.necessities.find((e) => e.id === id);
    return found ? [found.name] : [];
  });

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
