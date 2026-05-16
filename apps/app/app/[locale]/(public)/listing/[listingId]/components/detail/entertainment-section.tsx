import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";
import { Clock, MapPin, Users } from "lucide-react";
import DescriptionSection from "../description-section";

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

export default function EntertainmentSection({ detail, listing }: Props) {
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
