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

const resolve = (id: string | { id: string }) =>
  typeof id === "string" ? id : id.id;

export default function EntertainmentSection({ detail, listing }: Props) {
  const { data: filters } = useFilterOptions();

  const musicGenres = (listing.filters?.musicGenres ?? []).flatMap((id) => {
    const found = filters?.musicGenres.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const rules = (listing.filters.entertainmentRules ?? []).flatMap((id) => {
    const found = filters?.entertainmentRules.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const necessities = (listing.filters.necessities ?? []).flatMap((id) => {
    const found = filters?.necessities.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const technologies = (detail.options.technologies ?? []).flatMap((entry) => {
    const found = filters?.technologies.find(
      (e) => e.id === resolve(entry.technology),
    );
    return found ? [found.name] : [];
  });
  const services = (detail.options.services ?? []).flatMap((entry) => {
    const found = filters?.services.find((e) => e.id === resolve(entry.service));
    return found ? [found.name] : [];
  });

  const audience = (detail.audience ?? []).map((a) => audienceLabels[a] ?? a);

  return (
    <>
      {musicGenres.length > 0 && (
        <SectionWrapper title="Hudební žánry">
          <ChipList items={musicGenres} />
        </SectionWrapper>
      )}

      {audience.length > 0 && (
        <SectionWrapper title="Cílové publikum">
          <ChipList items={audience} />
        </SectionWrapper>
      )}

      {technologies.length > 0 && (
        <SectionWrapper title="Technika">
          <ChipList items={technologies} />
        </SectionWrapper>
      )}

      {services.length > 0 && (
        <SectionWrapper title="Služby">
          <ChipList items={services} />
        </SectionWrapper>
      )}

      {(detail.setupAndTearDown.setupTime != null ||
        detail.setupAndTearDown.tearDownTime != null) && (
        <SectionWrapper title="Příprava a úklid">
          <div className="flex flex-col gap-2">
            {detail.setupAndTearDown.setupTime != null && (
              <InfoRow
                icon={<Clock size={16} />}
                label="Příprava"
                value={`${detail.setupAndTearDown.setupTime} min`}
              />
            )}
            {detail.setupAndTearDown.tearDownTime != null && (
              <InfoRow
                icon={<Clock size={16} />}
                label="Úklid"
                value={`${detail.setupAndTearDown.tearDownTime} min`}
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
