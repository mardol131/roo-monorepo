import SectionWrapper from "../section-wrapper";
import { ChipList, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";

type GastroDetail = Extract<
  Listing["details"][number],
  { blockType: "gastro" }
>;

interface Props {
  detail: GastroDetail;
}

export default function GastroSection({ detail }: Props) {
  const cuisines = resolveNames(detail.cuisines ?? []);
  const dishTypes = resolveNames(detail.dishTypes ?? []);
  const dietary = resolveNames(detail.dietaryOptions ?? []);
  const serviceStyles = resolveNames(detail.foodServiceStyles ?? []);
  const necessities = resolveNames(detail.necessities ?? []);

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
