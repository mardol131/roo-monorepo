import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
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

  const equipmentItems = [
    ...(block.amenities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Vybavení",
            items: block.amenities,
          },
        ]
      : []),
    ...(block.technology?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technika",
            items: block.technology,
          },
        ]
      : []),
    ...(block.services?.length
      ? [{ type: "tagList" as const, label: "Služby", items: block.services }]
      : []),
    ...(block.activities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Aktivity",
            items: block.activities,
          },
        ]
      : []),
    ...(block.personnel?.length
      ? [
          {
            type: "tagList" as const,
            label: "Personál",
            items: block.personnel,
          },
        ]
      : []),
  ];

  const accessParkingItems = [
    ...(block.access?.vehicleTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy vozidel",
            items: block.access.vehicleTypes.map((v) => VEHICLE_LABELS[v] ?? v),
          },
        ]
      : []),
    ...(block.access?.helpWithLoadingAndUnloading != null
      ? [
          {
            type: "boolean" as const,
            label: "Pomoc s nakládkou",
            value: block.access.helpWithLoadingAndUnloading,
          },
        ]
      : []),
    ...(block.access?.loadingRamp != null
      ? [
          {
            type: "boolean" as const,
            label: "Nakládková rampa",
            value: block.access.loadingRamp,
          },
        ]
      : []),
    ...(block.access?.loadingElevator != null
      ? [
          {
            type: "boolean" as const,
            label: "Nákladní výtah",
            value: block.access.loadingElevator,
          },
        ]
      : []),
    ...(block.access?.serviceAccess != null
      ? [
          {
            type: "boolean" as const,
            label: "Servisní vstup",
            value: block.access.serviceAccess,
          },
        ]
      : []),
    ...(block.access?.serviceArea != null
      ? [
          {
            type: "boolean" as const,
            label: "Servisní plocha",
            value: block.access.serviceArea,
          },
        ]
      : []),
    ...(block.parking?.hasParking != null
      ? [
          {
            type: "boolean" as const,
            label: "Parkování",
            value: block.parking.hasParking,
          },
        ]
      : []),
    ...(block.parking?.parkingCapacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita parkoviště",
            value: `${block.parking.parkingCapacity} míst`,
          },
        ]
      : []),
    ...(block.parking?.parkingIsIncludedInPrice != null
      ? [
          {
            type: "boolean" as const,
            label: "Parkování v ceně",
            value: block.parking.parkingIsIncludedInPrice,
          },
        ]
      : []),
    ...(block.parking?.parkingPrice
      ? [
          {
            type: "text" as const,
            label: "Cena parkování",
            value: `${block.parking.parkingPrice} Kč`,
          },
        ]
      : []),
  ];

  const accommodationItems = [
    ...(block.hasAccommodation != null
      ? [
          {
            type: "boolean" as const,
            label: "Ubytování",
            value: block.hasAccommodation,
          },
        ]
      : []),
    ...(block.accommodationCapacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita ubytování",
            value: `${block.accommodationCapacity} lůžek`,
          },
        ]
      : []),
    ...(block.breakfast?.included != null
      ? [
          {
            type: "boolean" as const,
            label: "Snídaně",
            value: block.breakfast.included,
          },
        ]
      : []),
    ...(block.breakfast?.breakfastIsIncludedInPrice != null
      ? [
          {
            type: "boolean" as const,
            label: "Snídaně v ceně",
            value: block.breakfast.breakfastIsIncludedInPrice,
          },
        ]
      : []),
    ...(block.breakfast?.price
      ? [
          {
            type: "text" as const,
            label: "Cena snídaně",
            value: `${block.breakfast.price} Kč${block.breakfast.pricePer === "person" ? " / osoba" : " / rezervace"}`,
          },
        ]
      : []),
    ...(block.breakfast?.timeFrom && block.breakfast?.timeTo
      ? [
          {
            type: "text" as const,
            label: "Čas snídaně",
            value: `${block.breakfast.timeFrom} – ${block.breakfast.timeTo}`,
          },
        ]
      : []),
  ];

  const rulesItems = [
    ...(block.venueRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Pravidla prostoru",
            items: block.venueRules,
          },
        ]
      : []),
    ...(block.foodAndDrinkRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Pravidla pro jídlo a pití",
            items: block.foodAndDrinkRules,
          },
        ]
      : []),
  ];

  return (
    <>
      <DashboardSection
        title="Lokace"
        icon={"MapPin"}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <InfoSection
          items={[
            { type: "text", label: "Adresa", value: block.location.address },
            { type: "text", label: "Město", value: city },
            ...(block.placeTypes?.length
              ? [
                  {
                    type: "tagList" as const,
                    label: "Typ místa",
                    items: block.placeTypes,
                  },
                ]
              : []),
          ]}
        />
      </DashboardSection>

      <DashboardSection
        title="Prostory"
        icon={"Building2"}
        iconBg="bg-listing-surface"
        iconColor="text-listing"
      >
        <InfoSection
          items={[
            {
              type: "text",
              label: "Typ prostoru",
              value: SPACES_TYPE_LABELS[block.spacesType],
            },
            {
              type: "text",
              label: "Kapacita",
              value: `${block.capacity} osob`,
            },
            { type: "text", label: "Plocha", value: `${block.area} m²` },
            {
              type: "boolean",
              label: "Rezervace celého prostoru",
              value: block.canBeBookedAsWhole,
            },
          ]}
        />
      </DashboardSection>

      {equipmentItems.length > 0 && (
        <DashboardSection
          title="Vybavení a personál"
          icon={"Wifi"}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        >
          <InfoSection items={equipmentItems} />
        </DashboardSection>
      )}

      {accessParkingItems.length > 0 && (
        <DashboardSection
          title="Přístup a parkování"
          icon={"Car"}
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
          <InfoSection items={accessParkingItems} />
        </DashboardSection>
      )}

      {accommodationItems.length > 0 && (
        <DashboardSection
          title="Ubytování a snídaně"
          icon={"BedDouble"}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
        >
          <InfoSection items={accommodationItems} />
        </DashboardSection>
      )}

      {rulesItems.length > 0 && (
        <DashboardSection
          title="Pravidla"
          icon={"Shield"}
          iconBg="bg-red-50"
          iconColor="text-red-400"
        >
          <InfoSection items={rulesItems} />
        </DashboardSection>
      )}
    </>
  );
}
