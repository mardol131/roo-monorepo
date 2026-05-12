import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow, SubSection, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";
import { MapPin, Users } from "lucide-react";

type GastroDetail = Extract<
  Listing["details"][number],
  { blockType: "gastro" }
>;

interface Props {
  listing: Listing;
  detail: GastroDetail;
}

export default function GastroSection({ detail }: Props) {
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
      {/* Lokace */}
      {locationParts.length > 0 && (
        <SectionWrapper>
          <SubSection title="Kde působíme">
            <InfoRow
              icon={<MapPin size={16} />}
              label="Lokalita"
              value={locationParts.join(", ")}
            />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Kapacita */}
      <SectionWrapper>
        <SubSection title="Kapacita">
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
        </SubSection>
      </SectionWrapper>

      {/* Flagy */}
      {flags.length > 0 && (
        <SectionWrapper>
          <ChipList items={flags} />
        </SectionWrapper>
      )}

      {/* Kuchyně */}
      {cuisines.length > 0 && (
        <SectionWrapper>
          <SubSection title="Kuchyně">
            <ChipList items={cuisines} />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Typy jídel */}
      {dishTypes.length > 0 && (
        <SectionWrapper>
          <SubSection title="Typy jídel">
            <ChipList items={dishTypes} />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Dietní možnosti */}
      {dietary.length > 0 && (
        <SectionWrapper>
          <SubSection title="Dietní možnosti">
            <ChipList items={dietary} />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Forma servisu */}
      {serviceStyles.length > 0 && (
        <SectionWrapper>
          <SubSection title="Forma servisu">
            <ChipList items={serviceStyles} />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Požadavky */}
      {necessities.length > 0 && (
        <SectionWrapper>
          <SubSection title="Požadavky">
            <ChipList items={necessities} />
          </SubSection>
        </SectionWrapper>
      )}
    </>
  );
}
