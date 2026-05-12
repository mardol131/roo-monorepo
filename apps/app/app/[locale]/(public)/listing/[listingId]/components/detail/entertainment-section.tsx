import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow, SubSection, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";
import { Clock, MapPin, Users } from "lucide-react";

type EntertainmentDetail = Extract<
  Listing["details"][number],
  { blockType: "entertainment" }
>;

interface Props {
  listing: Listing;
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

  const cities = resolveNames(
    (detail.location.city ?? []) as (string | { name: string })[],
  );
  const regions = resolveNames(
    (detail.location.region ?? []) as (string | { name: string })[],
  );

  const locationParts = [detail.location.address, ...cities, ...regions].filter(
    Boolean,
  ) as string[];

  const audience = (detail.audience ?? []).map((a) => audienceLabels[a] ?? a);

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

      {/* Typy zábavy */}
      {entertainmentTypes.length > 0 && (
        <SectionWrapper>
          <SubSection title="Typy zábavy">
            <ChipList items={entertainmentTypes} />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Publikum */}
      {audience.length > 0 && (
        <SectionWrapper>
          <SubSection title="Cílové publikum">
            <ChipList items={audience} />
          </SubSection>
        </SectionWrapper>
      )}

      {/* Příprava a úklid */}
      {(detail.setupAndTearDownRules.setupTime != null ||
        detail.setupAndTearDownRules.tearDownTime != null) && (
        <SectionWrapper>
          <SubSection title="Příprava a úklid">
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
          </SubSection>
        </SectionWrapper>
      )}

      {/* Pravidla */}
      {rules.length > 0 && (
        <SectionWrapper>
          <SubSection title="Pravidla">
            <ChipList items={rules} />
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
