"use client";

import SectionWrapper from "../section-wrapper";
import { ChipList } from "../listing-ui";
import { Listing, ListingGastroDetail } from "@roo/common";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";

interface Props {
  detail: ListingGastroDetail;
  listing: Listing;
}

export default function GastroSection({ detail, listing }: Props) {
  const { data: filters } = useFilterOptions();

  const resolve = (id: string | { id: string }) =>
    typeof id === "string" ? id : id.id;

  const cuisines = (listing.options?.cuisines ?? []).flatMap((id) => {
    const found = filters?.cuisines.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const dishTypes = (listing.filters?.dishTypes ?? []).flatMap((id) => {
    const found = filters?.dishTypes.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const dietary = (listing.filters?.dietaryOptions ?? []).flatMap((id) => {
    const found = filters?.dietaryOptions.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const serviceStyles = (listing.options?.foodPreparationStyles ?? []).flatMap((id) => {
    const found = filters?.foodPreparationStyles.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });
  const necessities = (listing.filters?.necessities ?? []).flatMap((id) => {
    const found = filters?.necessities.find((e) => e.id === resolve(id));
    return found ? [found.name] : [];
  });

  const flags = [
    detail.hasAlcoholLicense && "Alkoholová licence",
    detail.kidsMenu && "Dětské menu",
  ].filter((f): f is string => !!f);

  return (
    <>
      {flags.length > 0 && (
        <SectionWrapper>
          <ChipList items={flags} />
        </SectionWrapper>
      )}

      {cuisines.length > 0 && (
        <SectionWrapper title="Kuchyně">
          <ChipList items={cuisines} />
        </SectionWrapper>
      )}

      {dishTypes.length > 0 && (
        <SectionWrapper title="Typy jídel">
          <ChipList items={dishTypes} />
        </SectionWrapper>
      )}

      {dietary.length > 0 && (
        <SectionWrapper title="Dietní možnosti">
          <ChipList items={dietary} />
        </SectionWrapper>
      )}

      {serviceStyles.length > 0 && (
        <SectionWrapper title="Forma servisu">
          <ChipList items={serviceStyles} />
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
