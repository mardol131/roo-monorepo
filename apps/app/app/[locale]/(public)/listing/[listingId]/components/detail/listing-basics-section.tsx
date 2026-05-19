import { Listing } from "@roo/common";
import { Accessibility, PawPrint, Tag, Users } from "lucide-react";
import { InfoRow } from "../listing-ui";
import SectionWrapper from "../section-wrapper";

export default function ListingBasicsSection({ listing }: { listing: Listing }) {
  const { guests, indoor, outdoor } = listing;

  const hasGuests = guests.max != null || guests.min != null;
  const hasEnvironment = indoor != null || outdoor != null;
  const hasAny = hasGuests || hasEnvironment || guests.ztp || guests.pets;

  if (!hasAny) return null;

  const environmentLabel =
    indoor && outdoor
      ? "Interiér i exteriér"
      : indoor
        ? "Interiér"
        : "Exteriér";

  return (
    <SectionWrapper title="Základní informace">
      <div className="grid grid-cols-2 gap-3">
        {guests.max != null && (
          <InfoRow
            icon={<Users size={16} />}
            label="Max. hostů"
            value={`${guests.max} osob`}
          />
        )}
        {guests.min != null && (
          <InfoRow
            icon={<Users size={16} />}
            label="Min. hostů"
            value={`${guests.min} osob`}
          />
        )}
        {hasEnvironment && (
          <InfoRow
            icon={<Tag size={16} />}
            label="Prostředí"
            value={environmentLabel}
          />
        )}
        {guests.ztp && (
          <InfoRow
            icon={<Accessibility size={16} />}
            label="Přístupnost"
            value="Bezbariérový přístup"
          />
        )}
        {guests.pets && (
          <InfoRow
            icon={<PawPrint size={16} />}
            label="Zvířata"
            value="Zvířata vítána"
          />
        )}
      </div>
    </SectionWrapper>
  );
}
