import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";
import { MapPin, Users } from "lucide-react";
import DescriptionSection from "../description-section";

type GastroDetail = Extract<
  Listing["details"][number],
  { blockType: "gastro" }
>;

interface Props {
  listing: Listing;
  detail: GastroDetail;
}

export default function GastroSection({ detail, listing }: Props) {
  const cuisines = resolveNames(detail.cuisines ?? []);
  const dishTypes = resolveNames(detail.dishTypes ?? []);
  const dietary = resolveNames(detail.dietaryOptions ?? []);
  const serviceStyles = resolveNames(detail.foodServiceStyles ?? []);
  const necessities = resolveNames(detail.necessities ?? []);

  const cities = resolveNames(
    (detail.location.city ?? []) as (string | { name: string })[],
  );
  const regions = resolveNames(
    (detail.location.region ?? []) as (string | { name: string })[],
  );

  const locationParts = [detail.location.address, ...cities, ...regions].filter(
    Boolean,
  ) as string[];

  const flags = [
    detail.hasAlcoholLicense && "Alkoholová licence",
    detail.kidsMenu && "Dětské menu",
  ].filter((f): f is string => !!f);

  return (
    <>
      {listing.description && (
        <SectionWrapper title="O tomto inzerátu">
          <DescriptionSection description={listing.description} />
        </SectionWrapper>
      )}

      {locationParts.length > 0 && (
        <SectionWrapper title="Kde působíme">
          <InfoRow
            icon={<MapPin size={16} />}
            label="Lokalita"
            value={locationParts.join(", ")}
          />
        </SectionWrapper>
      )}

      <SectionWrapper title="Kapacita">
        <div className="flex flex-col gap-2">
          <InfoRow
            icon={<Users size={16} />}
            label="Maximum"
            value={`${detail.capacity} osob`}
          />
          {detail.minimumCapacity != null && (
            <InfoRow
              icon={<Users size={16} />}
              label="Minimum"
              value={`${detail.minimumCapacity} osob`}
            />
          )}
        </div>
      </SectionWrapper>

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
