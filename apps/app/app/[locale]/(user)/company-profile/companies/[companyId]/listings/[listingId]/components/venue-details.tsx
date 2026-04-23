import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { DetailRow } from "@/app/[locale]/(user)/components/detail-row";
import { BoolBadge } from "@/app/[locale]/(user)/components/bool-badge";
import { Tag, TagList } from "@/app/[locale]/(user)/components/tag";
import Text from "@/app/components/ui/atoms/text";
import { Listing } from "@roo/common";
import { BedDouble, Building2, Car, MapPin, Shield, Wifi } from "lucide-react";

type VenueBlock = Extract<Listing["details"][number], { blockType: "venue" }>;

const SPACES_TYPE_LABELS: Record<VenueBlock["spacesType"], string> = {
  area: "Areál",
  building: "Budova",
  room: "Místnosti",
};

const VEHICLE_LABELS: Record<string, string> = {
  car: "Osobní auto",
  truck: "Nákladní auto",
  van: "Dodávka",
  bus: "Autobus",
};

export function VenueDetails({ block }: { block: VenueBlock }) {
  const city =
    typeof block.location.city === "string"
      ? block.location.city
      : block.location.city.name;

  return (
    <>
      <DashboardSection
        title="Lokace"
        icon={MapPin}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <DetailRow label="Adresa">
          <Text variant="body-sm" color="textDark">
            {block.location.address}
          </Text>
        </DetailRow>
        <DetailRow label="Město">
          <Text variant="body-sm" color="textDark">
            {city}
          </Text>
        </DetailRow>
        {block.placeTypes?.length ? (
          <DetailRow label="Typ místa">
            <TagList items={block.placeTypes} />
          </DetailRow>
        ) : null}
      </DashboardSection>

      <DashboardSection
        title="Prostory"
        icon={Building2}
        iconBg="bg-listing-surface"
        iconColor="text-listing"
      >
        <DetailRow label="Typ prostoru">
          <Text variant="body-sm" color="textDark">
            {SPACES_TYPE_LABELS[block.spacesType]}
          </Text>
        </DetailRow>
        <DetailRow label="Kapacita">
          <Text variant="body-sm" color="textDark">
            {block.capacity} osob
          </Text>
        </DetailRow>
        <DetailRow label="Plocha">
          <Text variant="body-sm" color="textDark">
            {block.area} m²
          </Text>
        </DetailRow>
        <DetailRow label="Rezervace celého prostoru">
          <BoolBadge value={block.canBeBookedAsWhole} />
        </DetailRow>
      </DashboardSection>

      {block.amenities?.length ||
      block.technology?.length ||
      block.services?.length ||
      block.activities?.length ||
      block.personnel?.length ? (
        <DashboardSection
          title="Vybavení a personál"
          icon={Wifi}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        >
          {block.amenities?.length ? (
            <DetailRow label="Vybavení">
              <TagList items={block.amenities} />
            </DetailRow>
          ) : null}
          {block.technology?.length ? (
            <DetailRow label="Technika">
              <TagList items={block.technology} />
            </DetailRow>
          ) : null}
          {block.services?.length ? (
            <DetailRow label="Služby">
              <TagList items={block.services} />
            </DetailRow>
          ) : null}
          {block.activities?.length ? (
            <DetailRow label="Aktivity">
              <TagList items={block.activities} />
            </DetailRow>
          ) : null}
          {block.personnel?.length ? (
            <DetailRow label="Personál">
              <TagList items={block.personnel} />
            </DetailRow>
          ) : null}
        </DashboardSection>
      ) : null}

      {block.access || block.parking ? (
        <DashboardSection
          title="Přístup a parkování"
          icon={Car}
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
          {block.access?.vehicleTypes?.length ? (
            <DetailRow label="Typy vozidel">
              <div className="flex flex-wrap gap-1.5">
                {block.access.vehicleTypes.map((v) => (
                  <Tag key={v} label={VEHICLE_LABELS[v] ?? v} />
                ))}
              </div>
            </DetailRow>
          ) : null}
          {block.access?.helpWithLoadingAndUnloading != null ? (
            <DetailRow label="Pomoc s nakládkou">
              <BoolBadge value={block.access.helpWithLoadingAndUnloading} />
            </DetailRow>
          ) : null}
          {block.access?.loadingRamp != null ? (
            <DetailRow label="Nakládková rampa">
              <BoolBadge value={block.access.loadingRamp} />
            </DetailRow>
          ) : null}
          {block.access?.loadingElevator != null ? (
            <DetailRow label="Nákladní výtah">
              <BoolBadge value={block.access.loadingElevator} />
            </DetailRow>
          ) : null}
          {block.access?.serviceAccess != null ? (
            <DetailRow label="Servisní vstup">
              <BoolBadge value={block.access.serviceAccess} />
            </DetailRow>
          ) : null}
          {block.access?.serviceArea != null ? (
            <DetailRow label="Servisní plocha">
              <BoolBadge value={block.access.serviceArea} />
            </DetailRow>
          ) : null}
          {block.parking?.hasParking != null ? (
            <DetailRow label="Parkování">
              <BoolBadge value={block.parking.hasParking} />
            </DetailRow>
          ) : null}
          {block.parking?.parkingCapacity ? (
            <DetailRow label="Kapacita parkoviště">
              <Text variant="body-sm" color="textDark">
                {block.parking.parkingCapacity} míst
              </Text>
            </DetailRow>
          ) : null}
          {block.parking?.parkingIsIncludedInPrice != null ? (
            <DetailRow label="Parkování v ceně">
              <BoolBadge value={block.parking.parkingIsIncludedInPrice} />
            </DetailRow>
          ) : null}
          {block.parking?.parkingPrice ? (
            <DetailRow label="Cena parkování">
              <Text variant="body-sm" color="textDark">
                {block.parking.parkingPrice} Kč
              </Text>
            </DetailRow>
          ) : null}
        </DashboardSection>
      ) : null}

      {block.hasAccommodation != null || block.breakfast ? (
        <DashboardSection
          title="Ubytování a snídaně"
          icon={BedDouble}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
        >
          {block.hasAccommodation != null ? (
            <DetailRow label="Ubytování">
              <BoolBadge value={block.hasAccommodation} />
            </DetailRow>
          ) : null}
          {block.accommodationCapacity ? (
            <DetailRow label="Kapacita ubytování">
              <Text variant="body-sm" color="textDark">
                {block.accommodationCapacity} lůžek
              </Text>
            </DetailRow>
          ) : null}
          {block.breakfast?.included != null ? (
            <DetailRow label="Snídaně">
              <BoolBadge value={block.breakfast.included} />
            </DetailRow>
          ) : null}
          {block.breakfast?.breakfastIsIncludedInPrice != null ? (
            <DetailRow label="Snídaně v ceně">
              <BoolBadge value={block.breakfast.breakfastIsIncludedInPrice} />
            </DetailRow>
          ) : null}
          {block.breakfast?.price ? (
            <DetailRow label="Cena snídaně">
              <Text variant="body-sm" color="textDark">
                {block.breakfast.price} Kč
                {block.breakfast.pricePer === "person"
                  ? " / osoba"
                  : " / rezervace"}
              </Text>
            </DetailRow>
          ) : null}
          {block.breakfast?.timeFrom && block.breakfast?.timeTo ? (
            <DetailRow label="Čas snídaně">
              <Text variant="body-sm" color="textDark">
                {block.breakfast.timeFrom} – {block.breakfast.timeTo}
              </Text>
            </DetailRow>
          ) : null}
        </DashboardSection>
      ) : null}

      {block.venueRules?.length || block.foodAndDrinkRules?.length ? (
        <DashboardSection
          title="Pravidla"
          icon={Shield}
          iconBg="bg-red-50"
          iconColor="text-red-400"
        >
          {block.venueRules?.length ? (
            <DetailRow label="Pravidla prostoru">
              <TagList items={block.venueRules} />
            </DetailRow>
          ) : null}
          {block.foodAndDrinkRules?.length ? (
            <DetailRow label="Pravidla pro jídlo a pití">
              <TagList items={block.foodAndDrinkRules} />
            </DetailRow>
          ) : null}
        </DashboardSection>
      ) : null}
    </>
  );
}
